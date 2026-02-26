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

  if (espSerial.available()) {

    String command = espSerial.readStringUntil('\n');
    command.trim();

    if (command == "START_TEST") {

      Serial.println("Running ASV Test...");
      runASVTest();
    }
  }
}

// =========================

void runASVTest() {

  peakCurrent = -32768;
  peakDAC = STRIP_START;

  // ===== 1. DEPOSITION =====
  dac.setVoltage(DEPOSITION_DAC, false);
  delay(DEPOSITION_TIME);
  delay(QUIET_TIME);

  // ===== 2. STRIPPING SWEEP =====
  for (int d = STRIP_START; d >= STRIP_END; d -= STRIP_STEP) {

    dac.setVoltage(d, false);
    delay(STRIP_DELAY);

    int16_t ref = ads.readADC_SingleEnded(3);
    int16_t sig = ads.readADC_SingleEnded(1);
    int16_t net = sig - ref;

    if (net > peakCurrent && net < 15000) {
      peakCurrent = net;
      peakDAC = d;
    }
  }

  // ===== 3. ANALYSIS =====
  String metal = "Unknown";

  if (peakDAC >= 2150 && peakDAC <= 2300) {
    metal = "Copper";
  }
  else if (peakDAC >= 2300 && peakDAC <= 2500) {
    metal = "Lead";
  }
  else if (peakDAC >= 2500 && peakDAC <= 2700) {
    metal = "Cadmium";
  }

  float concentration = 0;

  if (metal == "Copper") {
    concentration = abs(peakCurrent) * (1000.0 / 792.0);
  }

  if (concentration < 0) concentration = 0;

  // ===== 4. SEND CLEAN RESULT TO ESP32 =====

  espSerial.print("RESULT|");
  espSerial.print("Metal=");
  espSerial.print(metal);
  espSerial.print("|PeakDAC=");
  espSerial.print(peakDAC);
  espSerial.print("|PeakCurrent=");
  espSerial.print(peakCurrent);
  espSerial.print("|Concentration=");
  espSerial.println(concentration);

  Serial.println("ASV Result Sent.");
}
