import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { catchError, share } from 'rxjs/operators';
import { handleError } from './directives/handleError.directive';
import { ActiveUser } from './directives/user.directive';
import { Response } from './directives/response.directive';
import { environment } from '../../environments/environment' 

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = environment.apiPath + '/auth/'
  private userSubject: BehaviorSubject<ActiveUser>
  private user: Observable<ActiveUser>
  private activeUser: boolean
  private redirectUrl: string

  constructor(private httpService: HttpClient) {
    this.userSubject = new BehaviorSubject(null)
    this.activeUser = false
    this.redirectUrl = ''
  }

  getUser() {
    return this.userSubject
  }

  isActiveUser() {
    return this.activeUser
  }

  setRedirectUrl(url: string) {
    this.redirectUrl = url
  }

  getRedirectUrl() {
    return this.redirectUrl
  }

  login(username, password) {
    const observable = this.httpService.post<Response<ActiveUser>>(this.url + 'login', {
      username,
      password
    }).pipe(
      catchError(handleError),
      share()
    )
    observable.subscribe(
      res => {
        this.userSubject.next(res.data)
        this.activeUser = true
      },
      error => {
        console.log(error)
      }
    )
    return observable
  }

  signup(username, name, surname, email, password) {
    let observable = this.httpService.post<Response<ActiveUser>>(this.url + 'signup', {
      username,
      name,
      surname,
      email,
      password
    }).pipe(
      catchError(handleError),
      share()
    )
    observable.subscribe(
      res => {
        this.userSubject.next(res.data)
        this.activeUser = true
      },
      error => {
        console.log(error)
      }
    )
    return observable
  }

  logout() {
    this.userSubject.next(null)
    this.activeUser = false
  }
}