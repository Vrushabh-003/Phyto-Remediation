from flask import Flask, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
from pymongo import MongoClient
import os
from dotenv import load_dotenv
import warnings

load_dotenv()
warnings.filterwarnings('ignore')

# --- 1. Initialize Flask App and Load All Necessary Files ---
app = Flask(__name__)
CORS(app)

try:
    model = joblib.load('model.joblib')
    mlb = joblib.load('mlb.joblib')
    y_columns = joblib.load('y_columns.joblib') # <-- NEW: Load the plant names list
    plant_data = pd.read_csv('../Dataset.csv').set_index('Plant Scientific Name stringFilter')
except FileNotFoundError:
    print("FATAL ERROR: Make sure to run train_model.py successfully before starting the server.")
    exit()

# --- 2. Configure MongoDB Connection ---
MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise RuntimeError("MONGO_URI not set in .env file")
client = MongoClient(MONGO_URI)

db = client['phyto_remediation_db']
collection = db['soil_analysis'] 

# --- 3. Create the API Endpoint ---
@app.route('/api/recommendations', methods=['GET'])
def get_recommendations():
    try:
        latest_analysis = collection.find_one(sort=[("timestamp", -1)])

        if not latest_analysis or "contaminants" not in latest_analysis:
            return jsonify({"error": "No valid data found in the database. Please insert a sample document."}), 404

        contaminants_from_db = latest_analysis["contaminants"]

        # --- Use the ML Model to Predict ---
        input_data = mlb.transform([contaminants_from_db])
        predicted_encoded = model.predict(input_data)

        # --- Decode the Prediction using the correct plant list ---
        predicted_df = pd.DataFrame(predicted_encoded, columns=y_columns)
        scientific_names = predicted_df.apply(lambda row: row.idxmax(), axis=1).tolist()

        if not scientific_names:
             return jsonify({"error": "Model could not determine a recommendation for the given contaminants."}), 500

        # --- Format the Final JSON Response ---
        recommendations = []
        for name in scientific_names:
            try:
                # Get the row as a Series, then convert to dict
                plant_info_series = plant_data.loc[name]
                # ******* START FIX *******
                # Replace NaN values with None (which becomes null in JSON)
                plant_info = plant_info_series.where(pd.notna(plant_info_series), None).to_dict()
                # ******* END FIX *******

                recommendations.append({
                    "scientific_name": name,
                    "common_name": plant_info.get('Plant Common Name stringFilter'), # .get() defaults to None if key missing
                    "image_url": plant_info.get('Image imageType'),
                    "notes": plant_info.get('Notes')
                })
            except KeyError:
                print(f"Warning: Plant '{name}' predicted but not found in Dataset.csv details.")
                # Optionally add a placeholder if a predicted plant isn't in the details file
                recommendations.append({
                    "scientific_name": name,
                    "common_name": "N/A",
                    "image_url": None,
                    "notes": "Details not available."
                })


        return jsonify({"recommendations": recommendations})

    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"error": "An internal server error occurred."}), 500