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
  ot = [];
  oh = [];
  nt = [];
  nh = [];

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
    });
    this.apiservice.doRequestData().then(d => {
      for (let index = 0; index < d.length; index++) {
        this.ot = [...this.ot, {
          data: d[index].temperature,
          label: d[index].date.substring(d[index].date.length - 5)
        }]
        this.oh = [...this.oh, {
          data: d[index].humidity,
          label: d[index].date.substring(d[index].date.length - 5)
        }]        
      }
    });
    this.apiservice.doRequestNext().then(d => {
      for (let index = 0; index < d.length; index++) {
        this.nt = [...this.nt, {
          data: d[index].temperature,
          label: d[index].date.substring(d[index].date.length - 5)
        }]
        this.nh = [...this.nh, {
          data: d[index].humidity,
          label: d[index].date.substring(d[index].date.length - 5)
        }]        
      }
    });
  }

  onOutputTriggered(value: string) {
    alert("Der Output wurde ausgelöst. Daten: " + value);
  }
}
