import { Component, OnInit } from "@angular/core";
import { ApiService } from "./api/api.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  inputValue = "Ich werde in die DemoComponent hineingegeben";
  temperature = 0;
  humidity = 0;
  path =
    "http://st.wetteronline.de/dr/1.1.162/city/prozess/graphiken/symbole/standard/farbe/svg/centered/mdr2__.svg";

  constructor(private apiservice: ApiService) {}

  ngOnInit(): void {
    this.apiservice.doRequestCurrent().then(d => {
      this.temperature = d.temperature;
      this.humidity = d.humidity;
      if (this.humidity < 30) {
        this.path =
          "http://st.wetteronline.de/dr/1.1.162/city/prozess/graphiken/symbole/standard/farbe/svg/centered/so____.svg";
      } else if (this.humidity < 60) {
        this.path =
          "http://st.wetteronline.de/dr/1.1.162/city/prozess/graphiken/symbole/standard/farbe/svg/centered/wb____.svg";
      } else {
        this.path =
          "http://st.wetteronline.de/dr/1.1.162/city/prozess/graphiken/symbole/standard/farbe/svg/centered/mdr2__.svg";
      }

      console.log({ temp: this.temperature, hum: this.humidity });
      console.log(d);
    });
  }

  onOutputTriggered(value: string) {
    alert("Der Output wurde ausgelöst. Daten: " + value);
  }
}
