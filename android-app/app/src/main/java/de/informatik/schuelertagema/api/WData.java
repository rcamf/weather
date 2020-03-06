package de.informatik.schuelertagema.api;

import java.util.Calendar;
import java.util.Date;

public class WData {
    private int humidity;
    private double temperature;
    private Calendar Zeit;
    public WData(int pHumidity, double pTemperature, Calendar pTime){
        humidity = pHumidity;
        temperature = pTemperature;
        Zeit = pTime;
    }
  public int getHumidity(){
        return humidity;
  }
    public double getTemperature(){
        return temperature;
    }
    public Calendar getDate(){
        return Zeit;
    }
}

