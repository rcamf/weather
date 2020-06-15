import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Endpoint } from './directives/endpoint.directive';
import { retry, catchError } from 'rxjs/operators';
import { handleError } from './directives/handleError.directive';
import { Response } from './directives/response.directive';
import { WeatherData } from './directives/weather-data.directive';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EndpointService {
  private url = environment.apiPath + '/endpoints/'

  constructor(private httpClient: HttpClient) { }

  getEndpoints() {
    return this.httpClient.get<Response<Endpoint[]>>(this.url).pipe(
      retry(1),
      catchError(handleError)
    )
  }

  postEndpoint(city, country, lat, long, token) {
    return this.httpClient.post<Response<Endpoint>>(this.url, {
      city,
      country,
      lat,
      long
    }, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + token)
    }).pipe(
      catchError(handleError)
    )
  }

  getEndpoint(id) {
    return this.httpClient.get<Response<Endpoint>>(this.url + id).pipe(
      retry(1),
      catchError(handleError)
    )
  }

  deleteEndpoint(id, token) {
    return this.httpClient.delete<Response<undefined>>(this.url + id, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + token)
    }).pipe(
      catchError(handleError)
    )
  }

  getCurrentData(id) {
    return this.httpClient.get<Response<WeatherData>>(this.url + id + '/currentData').pipe(
      retry(1),
      catchError(handleError)
    )
  }

  getData(id) {
    return this.httpClient.get<Response<WeatherData[]>>(this.url + id + '/data').pipe(
      retry(1),
      catchError(handleError)
    )
  }

  getNextData(id) {
    return this.httpClient.get<Response<WeatherData[]>>(this.url + id + '/forecast').pipe(
      retry(1),
      catchError(handleError)
    )
  }
}