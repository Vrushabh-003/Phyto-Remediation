#include <SoftwareSerial.h>
#include <Adafruit_ADS1X15.h>
#include <Adafruit_MCP4725.h>

SoftwareSerial espSerial(10, 11); // RX, TX

Adafruit_ADS1115 ads;
Adafruit_MCP4725 dac;

// ===== PARAMETERS =====
#define DEPOSITION_DAC 2900
#define DEPOSITION_TIME 60000
#define QUIET_TIME 5000

#define STRIP_START 2400
#define STRIP_END 2050
#define STRIP_STEP 5
#define STRIP_DELAY 30

int16_t peakCurrent;
int peakDAC;

// =========================

void setup() {

  Serial.begin(9600);        // USB debug
  espSerial.begin(9600);     // ESP32 communication

  ads.begin();
  dac.begin(0x62);

  Serial.println("System Ready...");
}

// =========================

void loop() {

runASVTest();
  // if (espSerial.available()) {

  //   String command = espSerial.readStringUntil('\n');
  //   command.trim();

  //   if (command == "START_TEST") {

  //     // Serial.println("Running ASV Test...");
  //     runASVTest();
  //   }
  // }
}

// =========================


void runASVTest() {

  int prevNet = 0;
  int prevSlope = 0;
  int bestPeakValue = 0;
  int bestPeakDAC = 0;
  int pointIndex = 0;
  if (!ads.begin()) {
  Serial.println("ADS NOT DETECTED!");
  while (1);
}
  // Serial.print("Deposition");
  // ===== 1. DEPOSITION =====
  dac.setVoltage(DEPOSITION_DAC, false);
  delay(DEPOSITION_TIME);
  delay(QUIET_TIME);
  // Serial.println("Stripping");

  // ===== 2. STRIPPING SWEEP =====
  for (int d = STRIP_START; d >= STRIP_END; d -= STRIP_STEP) {

    dac.setVoltage(d, false);
    delay(STRIP_DELAY);

    int ref = ads.readADC_SingleEnded(3);
    int sig = ads.readADC_SingleEnded(1);
    int net = sig - ref;

    // For Serial Plotter
    Serial.print(d);
    Serial.print(",");
    Serial.println(net);

    pointIndex++;

    // Ignore first few capacitive points
    if (pointIndex < 8) {
      prevNet = net;
      continue;
    }

    int slope = net - prevNet;

    // Detect ANY extremum (peak or valley)
    if ((prevSlope > 0 && slope < 0) || 
        (prevSlope < 0 && slope > 0)) {

      if (abs(prevNet) > abs(bestPeakValue)) {
        bestPeakValue = prevNet;
        bestPeakDAC = d + STRIP_STEP;
      }
    }

    prevSlope = slope;
    prevNet = net;
  }

  peakCurrent = bestPeakValue;
  peakDAC = bestPeakDAC;

  // ===== 3. ANALYSIS =====
  String metal = "None";
  float concentration = 0;

  #define MIN_PEAK_THRESHOLD 100

  if (abs(peakCurrent) > MIN_PEAK_THRESHOLD) {

    if (peakDAC >= 2100 && peakDAC <= 2350)
      metal = "Copper";
    else if (peakDAC >= 2300 && peakDAC <= 2500)
      metal = "Lead";
    else if (peakDAC >= 2500 && peakDAC <= 2700)
      metal = "Cadmium";

    if (metal == "Copper") {
      concentration = abs(peakCurrent) * (1000.0 / 792.0);
    }
  }

  // ===== 4. SEND RESULT =====
  espSerial.print("RESULT|");
  espSerial.print("Metal=");
  espSerial.print(metal);
  espSerial.print("|PeakDAC=");
  espSerial.print(peakDAC);
  espSerial.print("|PeakCurrent=");
  espSerial.print(peakCurrent);
  espSerial.print("|Concentration=");
  espSerial.println(concentration);

  Serial.print("RESULT|");
  Serial.print("Metal=");
  Serial.print(metal);
  Serial.print("|PeakDAC=");
  Serial.print(peakDAC);
  Serial.print("|PeakCurrent=");
  Serial.print(peakCurrent);
  Serial.print("|Concentration=");
  Serial.println(concentration);
}




// void runASVTest() {

//   peakCurrent = -32768;
//   peakDAC = STRIP_START;

//   // ===== 1. DEPOSITION =====
//   dac.setVoltage(DEPOSITION_DAC, false);
//   delay(DEPOSITION_TIME);
//   delay(QUIET_TIME);

//   // ===== 2. STRIPPING SWEEP =====
//   for (int d = STRIP_START; d >= STRIP_END; d -= STRIP_STEP) {

//     dac.setVoltage(d, false);
//     delay(STRIP_DELAY);

//     int ref = ads.readADC_SingleEnded(3);
//     int sig = ads.readADC_SingleEnded(1);
//     int net = sig - ref;
//     // Serial.print("REF=");
//     // Serial.print(ref);
//     // Serial.print(" SIG=");
//     // Serial.print(sig);
//     // Serial.print(" NET=");
//     // Serial.println(net);
//     Serial.print(d);
// Serial.print(",");
// Serial.println(net);
//     if (abs(net) > abs(peakCurrent) && abs(net) < 15000) {
//       peakCurrent = net;
//       peakDAC = d;
// // Serial.print(d);
// // Serial.print(",");
// // Serial.println(net);
//  }
//   }
//   // ===== 3. ANALYSIS =====
//   String metal = "Unknown";

//   if (peakDAC >= 2150 && peakDAC <= 2300) {
//     metal = "Copper";
//   }
//   else if (peakDAC >= 2300 && peakDAC <= 2500) {
//     metal = "Lead";
//   }
//   else if (peakDAC >= 2500 && peakDAC <= 2700) {
//     metal = "Cadmium";
//   }

//   float concentration = 0;

//   if (metal == "Copper") {
//     concentration = abs(peakCurrent) * (1000.0 / 792.0);
//   }

//   if (concentration < 0) concentration = 0;

//   // ===== 4. SEND CLEAN RESULT TO ESP32 =====

//   espSerial.print("RESULT|");
//   espSerial.print("Metal=");
//   espSerial.print(metal);
//   espSerial.print("|PeakDAC=");
//   espSerial.print(peakDAC);
//   espSerial.print("|PeakCurrent=");
//   espSerial.print(peakCurrent);
//   espSerial.print("|Concentration=");
//   espSerial.println(concentration);

//   // Serial.println("ASV Result Sent.");
// }
