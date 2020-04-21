import { first, retry, catchError } from "rxjs/operators";

import { HttpClient } from "@angular/common/http";
import { Injectable, Inject } from "@angular/core";
import { WeatherData, EndpointData } from '../interfaces';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: "root"
})

export class EndpointService {
  private path: string = "http://localhost:8080/endpoints/"
  // Das ist Dependency Injection. Der ApiService fordert sozusagen den HttpClient (von Angular) an, mit dessen Hilfe man Anfragen an eine API ausführen kann
  constructor(private http: HttpClient) { }

  handleError(error) {
    if (error.error instanceof ErrorEvent) return throwError(`Error: ${error.error.message}`)
    return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`)
  }

  doRequestCurrent(endpoint: string) {
    // Durch http.get wird der Request ausgeführt, ein sogenannter GET-Request.
    // GET ist eine der Methoden, mit denen man Routen einer API aufrufen kann. Es gibt unter anderem auch noch POST, DELETE oder PUT
    // Wenn ihr mehr wissen wollt, fragt Dr. Google
    return this.http
      .get<{
        message: string
        data: WeatherData
      }>(this.path + endpoint + "/currentData")
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  doRequestData(endpoint: string) {
    // Durch http.get wird der Request ausgeführt, ein sogenannter GET-Request.
    // GET ist eine der Methoden, mit denen man Routen einer API aufrufen kann. Es gibt unter anderem auch noch POST, DELETE oder PUT
    // Wenn ihr mehr wissen wollt, fragt Dr. Google
    return this.http
      .get<{
        message: string
        data: WeatherData[]
      }>(this.path + endpoint + "/data")
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  doRequestNext(endpoint: string) {
    // Durch http.get wird der Request ausgeführt, ein sogenannter GET-Request.
    // GET ist eine der Methoden, mit denen man Routen einer API aufrufen kann. Es gibt unter anderem auch noch POST, DELETE oder PUT
    // Wenn ihr mehr wissen wollt, fragt Dr. Google
    return this.http
      .get<{
        message: string
        data: WeatherData[]
      }>(this.path + endpoint + "/nextData")
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  doPostEndpoint(name: string) {
    return this.http
      .post<{
        message: string
        data: EndpointData
      }>(this.path, { name })
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  doRequestEndpoints() {
    return this.http
      .get<{
        message: string
        data: EndpointData[]
      }>(this.path)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
}
