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

  constructor(private apiservice: ApiService) {}

  ngOnInit(): void {
    this.apiservice.doRequestCurrent().then(d => {
      this.temperature = d.temperature;
      this.humidity = d.humidity;
      console.log({ temp: this.temperature, hum: this.humidity });
      console.log(d);
    });
  }

  onOutputTriggered(value: string) {
    alert("Der Output wurde ausgelöst. Daten: " + value);
  }
}
