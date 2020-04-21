import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { EndpointService } from '../services/endpoint.service';
import { ActivatedRoute } from '@angular/router';
import { ValueData } from '../interfaces';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})

export class DashboardComponent implements OnChanges {
  @Input() endpoint: string

  temperature: number = 0;
  humidity: number = 0;
  path: string = ""
  prevTemperatures: ValueData[] = [];
  prevHumidities: ValueData[] = [];
  newTemperatures: ValueData[] = [];
  newHumidities: ValueData[] = [];

  constructor(private apiservice: EndpointService) {}

  ngOnChanges(): void {
    this.apiservice.doRequestCurrent(this.endpoint)
      .subscribe(
        current => {
          this.temperature = current.data.temperature;
          this.humidity = current.data.humidity;
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
        },
        err => console.log(err)
      )
    this.apiservice.doRequestData(this.endpoint)
      .subscribe(
        previousData => {
          this.prevTemperatures = []
          this.prevHumidities = []
          previousData.data.forEach(element => {
            this.prevTemperatures.push({
              data: element.temperature,
              label: element.date.substring(element.date.length - 5)
            })
            this.prevHumidities.push({
              data: element.humidity,
              label: element.date.substring(element.date.length - 5)
            })
          })
        },
        err => {
          this.prevTemperatures = []
          this.prevHumidities = []
          console.log(err)
        }
      )
    this.apiservice.doRequestNext(this.endpoint)
      .subscribe(
        nextData => {
          this.newTemperatures = []
          this.newHumidities = []
          nextData.data.forEach(element => {
            this.newTemperatures.push({
              data: element.temperature,
              label: element.date.substring(element.date.length - 5)
            })
            this.newHumidities.push({
              data: element.humidity,
              label: element.date.substring(element.date.length - 5)
            })
          })
        },
        err => {
          this.newTemperatures = []
          this.newHumidities = []
          console.log(err)
        }
      )
  }
}
