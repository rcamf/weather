const int LED_PIN = 13;

#include <SimpleDHT.h>

// for DHT11, 
//      VCC: 5V
//      GND: GND
//      DATA: 2
int pinDHT11 = 2;
SimpleDHT11 dht11(pinDHT11);

void setup() {
  Serial.begin(9600);
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  // start working...
 
  // read without samples.
  byte temperature = 0;
  byte humidity = 0;
  int err = SimpleDHTErrSuccess;
  if ((err = dht11.read(&temperature, &humidity, NULL)) != SimpleDHTErrSuccess) {
   
    return;
  }
  if ((int)humidity > 80){
    digitalWrite(LED_PIN, HIGH);
  }else{
    digitalWrite(LED_PIN, LOW);
    
   }
 Serial.print((int)temperature);
 Serial.print(",");
 Serial.println((int)humidity);
  
  // DHT11 sampling rate is 1HZ.
  delay(60000); //Werte pro Minute

}
