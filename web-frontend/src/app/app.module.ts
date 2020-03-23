import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ChartsModule } from 'ng2-charts';

import { AppComponent } from './app.component';
import { DataComponent } from './data/data.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { ImageComponent } from './image/image.component';

@NgModule({
  declarations: [AppComponent, DataComponent, ImageComponent, LineChartComponent],
  imports: [BrowserModule, ChartsModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
