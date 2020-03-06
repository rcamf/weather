import { first } from "rxjs/operators";

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class ApiService {
  // Das ist Dependency Injection. Der ApiService fordert sozusagen den HttpClient (von Angular) an, mit dessen Hilfe man Anfragen an eine API ausführen kann
  constructor(private http: HttpClient) {}

  doRequest() {
    // Durch http.get wird der Request ausgeführt, ein sogenannter GET-Request.
    // GET ist eine der Methoden, mit denen man Routen einer API aufrufen kann. Es gibt unter anderem auch noch POST, DELETE oder PUT
    // Wenn ihr mehr wissen wollt, fragt Dr. Google
    return this.http
      .get<{
        // Hier wird die Datenstruktur definiert, welche vom Server erwartet wird
        // Dies hat keinen Einfluss auf den Request, hilft uns aber beim Schreiben der Web-App, damit wir Tippfehler bemerken, was dann zu einem Compilerfehler führen würde.
        temperature: number;
        rainHours: number;
      }>("http://localhost:8080")
      .pipe(first())
      .toPromise();
  }
}
