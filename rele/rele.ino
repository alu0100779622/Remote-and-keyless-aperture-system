#include <SPI.h>
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <DNSServer.h>
#include <WiFiManager.h>

ESP8266WebServer server(80); 

IPAddress _ip = IPAddress(192,168,0,99);
IPAddress _gw = IPAddress(192,168,0,1);
IPAddress _sn = IPAddress(255, 255, 255, 0);

void setup() {

  Serial.begin(9600);      
  pinMode(D5, OUTPUT);    
  pinMode(BUILTIN_LED, OUTPUT); 
  
  digitalWrite(BUILTIN_LED, HIGH);
  WiFiManager wifiManager;
  
  // Descomentar para resetear configuración
  // wifiManager.resetSettings();
  
  const char* menu[] = {"wifi","exit"};
  wifiManager.setMenu(menu,2);
  wifiManager.setSTAStaticIPConfig(_ip,_gw,_sn);
  wifiManager.autoConnect("ApertureDevice");
  digitalWrite(BUILTIN_LED, LOW);
  
  Serial.printf("Connected\n");
  server.on("/", HTTP_POST, rele);
  server.begin();                           
  printWifiStatus();                        
}


void loop() {
  server.handleClient();
}

void rele(){
  if (server.arg("rele") == "ON"){
      digitalWrite(D5, HIGH);
      delay(1500);
      digitalWrite(D5, LOW); 
  }
  server.sendHeader("Location","/");
  server.send(303);
}

void printWifiStatus() {
  // print the SSID of the network you're attached to:
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  // print your WiFi shield's IP address:
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);

  // print the received signal strength:
  long rssi = WiFi.RSSI();
  Serial.print("signal strength (RSSI):");
  Serial.print(rssi);
  Serial.println(" dBm");
  // print where to go in a browser:
  Serial.print("To see this page in action, open a browser to http://");
  Serial.println(ip);
}
