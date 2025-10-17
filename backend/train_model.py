import pandas as pd
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.multioutput import MultiOutputClassifier
import joblib
import warnings

warnings.filterwarnings('ignore')

# --- 1. Load the Dataset ---
try:
    df = pd.read_csv('../Dataset.csv')
except FileNotFoundError:
    print("Error: Dataset.csv not found. Make sure it's in the project's root directory.")
    exit()

# --- 2. Preprocess the Data ---
# CRITICAL: Drop rows with missing contaminants BEFORE creating X and y
df.dropna(subset=['Contaminants Csvfilteror'], inplace=True)
df.reset_index(drop=True, inplace=True) # Reset index after dropping rows

# Create the list of contaminants for the binarizer
df['Contaminants_List'] = df['Contaminants Csvfilteror'].apply(lambda x: [cont.strip() for cont in x.split(',')])

mlb = MultiLabelBinarizer()
X = mlb.fit_transform(df['Contaminants_List'])

# Create the target variable (plant names) and its one-hot encoded version
y = df['Plant Scientific Name stringFilter']
y_dummies = pd.get_dummies(y)
y_columns = y_dummies.columns # Get the list of plant names

# --- 3. Train the Model ---
forest = RandomForestClassifier(n_estimators=100, random_state=42, class_weight='balanced')
model = MultiOutputClassifier(estimator=forest)
model.fit(X, y_dummies)

# --- 4. Save the Model, Binarizer, AND Target Columns ---
joblib.dump(model, 'model.joblib')
joblib.dump(mlb, 'mlb.joblib')
joblib.dump(y_columns, 'y_columns.joblib') # <-- NEW: Save the plant names list

print("✅ Model, Binarizer, and Target Columns have been trained and saved successfully!")
print("Saved files: model.joblib, mlb.joblib, y_columns.joblib")