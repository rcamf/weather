import { Component, Input, OnInit, OnChanges, IterableDiffers, IterableDiffer } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})

export class LineChartComponent {
  @Input() data: any;
  @Input() header: string;
  iterableDiffer: IterableDiffer<[]>;

  constructor(private iterableDiffers: IterableDiffers) {
    this.iterableDiffer = iterableDiffers.find([]).create(null)
  }  

  ngOnInit() {}

  lineChartData: ChartDataSets[] = [
    { data: [], label: '' },
  ];
  lineChartLabels: Label[] = [];
  lineChartOptions = {
    responsive: true,
    scales: {
      xAxes: [
        {
          gridLines: {
            color: 'rgba(255, 255, 255, 0.5)'
          },
          ticks: {
            fontColor: 'rgba(255, 187, 0, 1)',
            fontFamily: 'Raleway'
          }
        }
      ],
      yAxes: [
        {
          gridLines: {
            color: 'rgba(255, 255, 255, 0.5)'
          },
          ticks: {
            fontColor: 'rgba(255, 187, 0, 1)',
            fontFamily: 'Raleway'
          }
        }
      ]
    },
    legend: {
      labels: {
        fontColor: 'rgba(255, 187, 0, 1)',
        fontFamily: 'Raleway'
      }
    }
  };
  lineChartColors: Color[] = [
    {
      borderColor: 'rgba(255, 187, 0, 1)',
      backgroundColor: 'rgba(255, 187, 0, 0.5)'
    },
  ];
  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';

  ngOnChanges() {
    if (this.data.length) {
      let data = []
      let labels = []
      this.data.forEach(object => {
        data.push(object.data)
        labels.push(object.label)
      })
      this.lineChartData[0].data = data
      this.lineChartData[0].label = this.header
      this.lineChartLabels = labels
    } 
  }
  

  

  
}