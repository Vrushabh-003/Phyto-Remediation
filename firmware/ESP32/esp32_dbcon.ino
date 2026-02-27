#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "POCO X4 PRO";
const char* password = "12345678";

// 🔹 Replace with your PC IP
const char* commandUrl = "https://esp32-backend-0f9l.onrender.com/api/device-command";
const char* resultUrl  = "https://esp32-backend-0f9l.onrender.com/api/results";

#define RXD2 16
#define TXD2 17

bool testRunning = false;

void setup() {
  Serial.begin(115200);
  Serial2.begin(9600, SERIAL_8N1, RXD2, TXD2);

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi Connected ✅");
}

void loop() {

  // 🔹 Poll backend if not currently testing
  if (!testRunning) {
    checkForCommand();
  }

  // 🔹 Check Arduino result
  if (Serial2.available()) {

    String result = Serial2.readStringUntil('\n');
    result.trim();

    Serial.print("Received raw: ");
    Serial.println(result);

    if (result.startsWith("RESULT|")) {

        Serial.println("Valid RESULT detected!");
        Serial.println("Sending result to backend...");
        sendResultToBackend(result);
        testRunning = false;
    }
}


  delay(3000);
}

void checkForCommand() {

  if (WiFi.status() == WL_CONNECTED) {

    HTTPClient http;
    http.begin(commandUrl);

    int httpCode = http.GET();

    if (httpCode == 200) {

      String response = http.getString();

      StaticJsonDocument<128> doc;
      DeserializationError error = deserializeJson(doc, response);

      if (!error) {
        String cmd = doc["command"];

        if (cmd == "START_TEST") {
          Serial.println("START_TEST received from backend");

          Serial2.println("START_TEST");
          testRunning = true;
        }
      }
    }

    http.end();
  }
}

// void sendResultToBackend(String result) {


//   // Remove "RESULT|"
//   result.replace("RESULT|", "");
  

//   int lead = 0, copper = 0, cadmium = 0;

//   sscanf(result.c_str(), "Lead=%d|Copper=%d|Cadmium=%d",
//          &lead, &copper, &cadmium);

//   StaticJsonDocument<256> doc;

//   doc["Id"] = "SNS-011-L3";

//   JsonObject metals = doc.createNestedObject("metals_detected");
//   metals["Lead"] = lead;
//   metals["Copper"] = copper;
//   metals["Cadmium"] = cadmium;

//   String jsonOutput;
//   serializeJson(doc, jsonOutput);
//   Serial.println("JSON being sent:");
//   Serial.println(jsonOutput);
//   HTTPClient http;
//   http.begin(resultUrl);
//   http.addHeader("Content-Type", "application/json");

//   int responseCode = http.POST(jsonOutput);

//   Serial.print("POST Response Code: ");
//   Serial.println(responseCode);

//   http.end();
// }






void sendResultToBackend(String result) {

  result.replace("RESULT|", "");

  char metal[20];
  int peakDAC;
  int peakCurrent;
  float concentration;

  sscanf(result.c_str(),
         "Metal=%[^|]|PeakDAC=%d|PeakCurrent=%d|Concentration=%f",
         metal, &peakDAC, &peakCurrent, &concentration);

  StaticJsonDocument<256> doc;

  doc["Id"] = "SNS-011-L3";
  doc["peak_dac"] = peakDAC;
  doc["peak_current"] = peakCurrent;

  JsonObject metals = doc.createNestedObject("metals_detected");
  metals[metal] = concentration;

  String jsonOutput;
  serializeJson(doc, jsonOutput);

  Serial.println("JSON being sent:");
  Serial.println(jsonOutput);

  HTTPClient http;
  http.begin(resultUrl);
  http.addHeader("Content-Type", "application/json");

  int responseCode = http.POST(jsonOutput);

  Serial.print("POST Response Code: ");
  Serial.println(responseCode);

  http.end();
}

