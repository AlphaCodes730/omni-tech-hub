/*
 * =========================================================================
 * OMNI-TECH-HUB — ARDUINO CYBERSECURITY ROVER FIRMWARE (rover_core.ino)
 * Author: Kelvin Wambugu Muregi (AlphaCodes730)
 * Description: Motor drive, ultrasonic perimeter sweep, and dual
 *              Wi-Fi / Bluetooth JSON telemetry bridge.
 * =========================================================================
 */

#include <SoftwareSerial.h>

// --- Wireless Telemetry Bridge (HC-05 Bluetooth or ESP8266 Wi-Fi Module) ---
// Connect Module TX -> Arduino Pin 2 | Module RX -> Arduino Pin 3 (via voltage divider)
SoftwareSerial wirelessSerial(2, 3); // (RX, TX)

// --- L298N Motor Driver Pin Definitions ---
const int ENA = 5;   // Left Motor PWM Speed
const int IN1 = 6;
const int IN2 = 7;

const int ENB = 10;  // Right Motor PWM Speed
const int IN3 = 8;
const int IN4 = 9;

// --- Ultrasonic Perimeter Sensor (HC-SR04) ---
const int TRIG_PIN = 11;
const int ECHO_PIN = 12;

// --- Security Alert & Status Indicators ---
const int STATUS_LED = 13;
const int BUZZER_PIN = 4;

// --- System Parameters ---
int driveSpeed = 185;                  // PWM speed (0 - 255)
const int OBSTACLE_THRESHOLD = 25;     // Minimum safe distance in cm
bool patrolMode = false;               // Autonomous patrol toggle
unsigned long lastTelemetryTime = 0;
const unsigned long TELEMETRY_INTERVAL = 1000; // Broadcast telemetry every 1s

void setup() {
  Serial.begin(9600);
  wirelessSerial.begin(9600); // Standard baud rate for HC-05 / ESP-01 bridge

  pinMode(ENA, OUTPUT);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(ENB, OUTPUT);
  pinMode(IN3, OUTPUT);
  pinMode(IN4, OUTPUT);

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(STATUS_LED, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);

  stopMotors();
  broadcastMessage("[OMNI-ROVER] Core + Wi-Fi/BT Telemetry Online. Commands: F/B/L/R/S/P/T");
}

void loop() {
  // 1. Check USB Serial Commands
  if (Serial.available() > 0) {
    char cmd = toupper(Serial.read());
    handleCommand(cmd);
  }

  // 2. Check Bluetooth / Wi-Fi Wireless Commands
  if (wirelessSerial.available() > 0) {
    char cmd = toupper(wirelessSerial.read());
    handleCommand(cmd);
  }

  // 3. Measure Perimeter Distance
  long distanceCm = measureDistance();
  bool intrusionAlert = false;

  // 4. Autonomous Patrol & Collision Avoidance
  if (patrolMode) {
    if (distanceCm > 0 && distanceCm < OBSTACLE_THRESHOLD) {
      intrusionAlert = true;
      triggerAlert();
      stopMotors();
      delay(200);
      moveBackward();
      delay(350);
      turnRight();
      delay(450);
      moveForward();
    } else {
      moveForward();
    }
  } else if (distanceCm > 0 && distanceCm < 12) {
    intrusionAlert = true;
    stopMotors();
    triggerAlert();
  }

  // 5. Periodic JSON Telemetry Broadcast (Every 1 Second)
  if (millis() - lastTelemetryTime >= TELEMETRY_INTERVAL) {
    lastTelemetryTime = millis();
    sendJsonTelemetry(distanceCm, intrusionAlert);
  }

  delay(50);
}

// =========================================================================
// WIRELESS & SERIAL TELEMETRY FUNCTIONS
// =========================================================================
void broadcastMessage(const char* msg) {
  Serial.println(msg);
  wirelessSerial.println(msg);
}

void sendJsonTelemetry(long distance, bool alert) {
  String payload = "{\"device\":\"OMNI-ROVER\",\"distance_cm\":";
  payload += distance;
  payload += ",\"mode\":\"";
  payload += (patrolMode ? "PATROL" : "MANUAL");
  payload += "\",\"speed\":";
  payload += driveSpeed;
  payload += ",\"alert\":";
  payload += (alert ? "true" : "false");
  payload += "}";

  Serial.println(payload);
  wirelessSerial.println(payload);
}

// =========================================================================
// COMMAND DISPATCHER
// =========================================================================
void handleCommand(char cmd) {
  switch (cmd) {
    case 'F':
      patrolMode = false;
      moveForward();
      broadcastMessage("[CMD] Forward");
      break;
    case 'B':
      patrolMode = false;
      moveBackward();
      broadcastMessage("[CMD] Backward");
      break;
    case 'L':
      patrolMode = false;
      turnLeft();
      broadcastMessage("[CMD] Left");
      break;
    case 'R':
      patrolMode = false;
      turnRight();
      broadcastMessage("[CMD] Right");
      break;
    case 'S':
      patrolMode = false;
      stopMotors();
      broadcastMessage("[CMD] Stop");
      break;
    case 'P':
      patrolMode = !patrolMode;
      if (!patrolMode) stopMotors();
      broadcastMessage(patrolMode ? "[MODE] Patrol ENABLED" : "[MODE] Patrol DISABLED");
      break;
    case '+':
      driveSpeed = min(255, driveSpeed + 25);
      broadcastMessage("[SPEED] Increased");
      break;
    case '-':
      driveSpeed = max(80, driveSpeed - 25);
      broadcastMessage("[SPEED] Decreased");
      break;
    case 'T':
      sendJsonTelemetry(measureDistance(), false);
      break;
  }
}

// =========================================================================
// MOTOR DRIVE & SENSOR FUNCTIONS
// =========================================================================
void moveForward() {
  analogWrite(ENA, driveSpeed);
  analogWrite(ENB, driveSpeed);
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, HIGH);
  digitalWrite(IN4, LOW);
}

void moveBackward() {
  analogWrite(ENA, driveSpeed);
  analogWrite(ENB, driveSpeed);
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, HIGH);
}

void turnLeft() {
  analogWrite(ENA, driveSpeed);
  analogWrite(ENB, driveSpeed);
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
  digitalWrite(IN3, HIGH);
  digitalWrite(IN4, LOW);
}

void turnRight() {
  analogWrite(ENA, driveSpeed);
  analogWrite(ENB, driveSpeed);
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, HIGH);
}

void stopMotors() {
  analogWrite(ENA, 0);
  analogWrite(ENB, 0);
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, LOW);
}

long measureDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long duration = pulseIn(ECHO_PIN, HIGH, 25000);
  if (duration == 0) return -1;
  return duration * 0.034 / 2;
}

void triggerAlert() {
  digitalWrite(STATUS_LED, HIGH);
  tone(BUZZER_PIN, 1200, 120);
  digitalWrite(STATUS_LED, LOW);
}

