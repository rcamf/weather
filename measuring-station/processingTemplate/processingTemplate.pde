import processing.serial.*;
import java.util.*;
import java.nio.file.*;
import java.nio.charset.StandardCharsets;

void setup() {
  size (400, 130);
}
 
void draw() {
  background(50);
  
  int tempC = 0;
  int humidity = 0;
  
  
  
  textSize(24);
  text("Temperatur",10,50);
  text("Feuchtigkeit",200,50);
  textSize(32);
  text(tempC + " C°",10,100);
  text(humidity + " %",200,100);
}
