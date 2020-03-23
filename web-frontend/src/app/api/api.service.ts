import { first } from "rxjs/operators";

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class ApiService {
  // Das ist Dependency Injection. Der ApiService fordert sozusagen den HttpClient (von Angular) an, mit dessen Hilfe man Anfragen an eine API ausführen kann
  constructor(private http: HttpClient) {}

  doRequestCurrent() {
    // Durch http.get wird der Request ausgeführt, ein sogenannter GET-Request.
    // GET ist eine der Methoden, mit denen man Routen einer API aufrufen kann. Es gibt unter anderem auch noch POST, DELETE oder PUT
    // Wenn ihr mehr wissen wollt, fragt Dr. Google
    return this.http
      .get<{
        date: string
        temperature: number
        humidity: number
      }>("http://localhost:8080/api/getCurrentData")
      .pipe(first())
      .toPromise();
  }
  doRequestData() {
    // Durch http.get wird der Request ausgeführt, ein sogenannter GET-Request.
    // GET ist eine der Methoden, mit denen man Routen einer API aufrufen kann. Es gibt unter anderem auch noch POST, DELETE oder PUT
    // Wenn ihr mehr wissen wollt, fragt Dr. Google
    return this.http
      .get<[{
        date: string
        temperature: number
        humidity: number
      }]>("http://localhost:8080/api/getData")
      .pipe(first())
      .toPromise();
  }
  doRequestNext() {
    // Durch http.get wird der Request ausgeführt, ein sogenannter GET-Request.
    // GET ist eine der Methoden, mit denen man Routen einer API aufrufen kann. Es gibt unter anderem auch noch POST, DELETE oder PUT
    // Wenn ihr mehr wissen wollt, fragt Dr. Google
    return this.http
      .get<[{
        date: string
        temperature: number
        humidity: number
      }]>("http://localhost:8080/api/getNextData")
      .pipe(first())
      .toPromise();
  }
}
