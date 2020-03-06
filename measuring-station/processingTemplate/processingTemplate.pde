import processing.serial.*;
import java.util.*;
import java.nio.file.*;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.Calendar;


Serial serial;
String ausgabe;
String temp = "";
String humidity = "";

void setup() {
  size (400, 130);
   printArray(Serial.list());
   serial = new Serial(this, Serial.list()[0], 9600);
   serial.bufferUntil('\n');
}
 
void draw() {
  background(50);
  
  
  
  textSize(24);
  text("Temperatur",10,50);
  text("Feuchtigkeit",200,50);
  textSize(32);
  text(temp + " C°",10,100);
  text(humidity + " %",200,100);
}

void serialEvent(Serial p) { 
  ausgabe = p.readString(); 
  print(ausgabe);
  String[] parts = ausgabe.split(",");
  temp = parts[0];
  humidity = parts[1];
  
  println(temp);
  println(humidity);
  String timeStamp = new SimpleDateFormat("yyyy-MM-dd-HH-mm").format(Calendar.getInstance().getTime());
  println(timeStamp );

  
  List<String> lines =  Arrays.asList("{", "\"temperature\": " + temp + ",",  "\"humidity\": " + humidity,"}");
  //List<String> lines =  Arrays.asList("asdkfsda2");
  Path file = Paths.get("/Users/tsunami/"+ timeStamp+".txt");
  try {
    Files.write(file, lines, StandardCharsets.UTF_8);
  }
  catch(IOException e) {
    println("doooooooom");
    return;
  }
  
} 
