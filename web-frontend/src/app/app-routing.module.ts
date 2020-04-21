import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EndpointsComponent } from './endpoints/endpoints.component';
import { WeatherComponent } from './weather/weather.component';

const routes: Routes = [
  { path: '', component: WeatherComponent },
  { path: 'endpunkte', component: EndpointsComponent}
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
