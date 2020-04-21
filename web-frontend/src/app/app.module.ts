import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ChartsModule } from 'ng2-charts';

import { AppComponent } from './app.component';
import { DataComponent } from './data/data.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { ImageComponent } from './image/image.component';
import { TabComponent } from './tab/tab.component';
import { TabsComponent } from './tabs/tabs.component';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EndpointsComponent } from './endpoints/endpoints.component';
import { WeatherComponent } from './weather/weather.component';

@NgModule({
  declarations: [AppComponent, DataComponent, ImageComponent, LineChartComponent, TabComponent, TabsComponent, DashboardComponent, EndpointsComponent, WeatherComponent],
  imports: [BrowserModule, ChartsModule, HttpClientModule, AppRoutingModule],
  providers: [
    { provide: 'endpoint', useValue: "" }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
