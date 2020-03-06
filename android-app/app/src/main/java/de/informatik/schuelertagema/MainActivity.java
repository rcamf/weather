package de.informatik.schuelertagema;

import androidx.appcompat.app.AppCompatActivity;

import android.graphics.Color;
import android.os.AsyncTask;
import android.os.Bundle;
import android.widget.TextView;

import java.io.IOException;
import java.util.Calendar;

import de.informatik.schuelertagema.api.ReqClient;
import de.informatik.schuelertagema.api.WData;


public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
DisplayWeatherTask dw = new DisplayWeatherTask();
dw.execute();



    }


    private class DisplayWeatherTask extends AsyncTask<Void, Void, WData[]> {
        protected WData[] doInBackground(Void... x) {
            ReqClient r = new ReqClient();

            try {
                WData[] a = r.request();
                return a;
            } catch (IOException e) {
                e.printStackTrace();

            }
            return null;
        }


        protected void onPostExecute(WData[] a) {
            TextView ort = findViewById(R.id.ortdatum);
            ort.setTextSize(30);
            String ortname = "Bonn";
            ort.setTextColor(Color.parseColor("#ffffff"));
            WData aktD = a[a.length - 1];
            WData vor1D = a[0];
            Calendar cal = aktD.getDate();
            ort.setText(ortname + ", den " + cal.get( Calendar.DAY_OF_MONTH ) + "." + (cal.get( Calendar.MONTH )+1) + "." + cal.get( Calendar.YEAR ));
            TextView plAktuelleTemperatur = findViewById(R.id.plAktuelleTemperatur);
            plAktuelleTemperatur.setText("Aktuelle Temperatur:");
            plAktuelleTemperatur.setTextSize(20);
            plAktuelleTemperatur.setTextColor(Color.parseColor("#ffffff"));
            TextView temperatur = findViewById(R.id.temperatur);
            double temperaturgrad = aktD.getTemperature();
            temperatur.setText(temperaturgrad + "°C");
            temperatur.setTextSize(20);
            temperatur.setTextColor(Color.parseColor("#ffffff"));
            TextView Feuchtigkeit = findViewById(R.id.textView5);
            int lF = aktD.getHumidity();
            Feuchtigkeit.setText(lF+"%");
            TextView vor1 = findViewById(R.id.tv3);
            double vor1temp = vor1D.getTemperature();
            vor1.setText(vor1temp+"°C");
            Feuchtigkeit.setTextSize(20);
            vor1.setTextSize(20);
            TextView lFeucht = findViewById(R.id.textView4);
            lFeucht.setTextSize(20);
            vor1.setTextColor(Color.parseColor("#ffffff"));
            TextView lvor1h = findViewById(R.id.textView9);
            lvor1h.setTextColor(Color.parseColor("#ffffff"));
            lvor1h.setTextSize(16);


        }
    }






}
