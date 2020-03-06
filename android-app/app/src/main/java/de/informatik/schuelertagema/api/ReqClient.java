package de.informatik.schuelertagema.api;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;



import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class ReqClient {
    URL url;

    public ReqClient() {
        try {
            url = new URL("http://192.168.55.112:8080/api/getdata");
        } catch (MalformedURLException f) {
            f.printStackTrace();
        }

    }

    public WData[] request() throws IOException {
        HttpURLConnection con = (HttpURLConnection) url.openConnection();
        con.setRequestMethod("GET");

        BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
        String inputLine;
        StringBuffer content = new StringBuffer();
        while ((inputLine = in.readLine()) != null) {
            content.append(inputLine);
        }
        in.close();
        try {
            JSONArray eingabe = new JSONArray(inputLine);
            WData[] WDataArray = new WData[eingabe.length()];
            for(int i =0;i<eingabe.length();i++){
                JSONObject temp = eingabe.getJSONObject(i);
                Calendar t = Calendar.getInstance();
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-M-d-HH-mm");
                t.setTime(sdf.parse(temp.getString("date")));
                WDataArray[i]= new WData(temp.getInt("humidity"),temp.getDouble("temperature"), t);
            }
            return WDataArray;

        } catch (ParseException | JSONException je) {
            je.printStackTrace();
        }
        return null;
    }
}

