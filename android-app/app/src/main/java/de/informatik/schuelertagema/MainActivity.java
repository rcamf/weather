package de.informatik.schuelertagema;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.widget.TextView;

import java.util.Calendar;


public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        TextView ort = findViewById(R.id.ortdatum);
        ort.setTextSize(30);
        String ortname = "Bonn";
        Calendar cal = Calendar.getInstance();
        cal.set(2020,3,6,12,0);
        ort.setText(ortname + ", den " + cal.get( Calendar.DAY_OF_MONTH ) + "." + cal.get( Calendar.MONTH ) + "." + cal.get( Calendar.YEAR ));
        TextView plAktuelleTemperatur = findViewById(R.id.plAktuelleTemperatur);
        plAktuelleTemperatur.setText("Aktuelle Temperatur:");
        plAktuelleTemperatur.setTextSize(20);
        TextView temperatur = findViewById(R.id.temperatur);
        int temperaturgrad = 0;
        temperatur.setText(temperaturgrad + "°C");
        temperatur.setTextSize(20);



    }





}
