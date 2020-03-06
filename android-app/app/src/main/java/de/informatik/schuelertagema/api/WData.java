package de.informatik.schuelertagema.api;

import java.util.Calendar;
import java.util.Date;

public class WData {
    int humidity;
    double temperature;
    private Calendar Zeit;
    public WData(int pHumidity, double pTemperature, Calendar pTime){
        humidity = pHumidity;
        temperature = pTemperature;
        Zeit = pTime;
    }

}

