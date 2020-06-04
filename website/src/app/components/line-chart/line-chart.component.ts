import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { WeatherData } from 'src/app/core/directives/weather-data.directive';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit, OnChanges {
  @Input() data: WeatherData[]
  lineChartData: ChartDataSets[] = [
    { data: [], label: 'Temperature', yAxisID: 'yAxis0' },
    { data: [], label: 'Humidity', yAxisID: 'yAxis1' }
  ]
  lineChartLabels: Label[] = [ '1', '2', '3', '4' ]
  lineChartOptions: ChartOptions = {
    scales: {
      yAxes: [
        {
          id: 'yAxis0',
          position: 'left'
        },
        {
          id: 'yAxis1',
          position: 'right'
        }
      ]
    }
  }
  lineChartColors: Color[] = []
  lineChartLegend = true
  lineChartType = 'line'

  constructor() { }

  ngOnInit(): void { }

  ngOnChanges(): void {
    if (this.data) {
      this.lineChartData[0].data = []
      this.lineChartData[1].data = []
      this.lineChartLabels = []
      this.data.forEach(weatherData => {
        this.lineChartData[0].data.push(weatherData.temperature)
        this.lineChartData[0].data.push(weatherData.humidity)
        this.lineChartLabels.push(weatherData.date)
    })
    }
  }
}
