import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
import { handleError } from './directives/handleError.directive';
import { Response } from './directives/response.directive';
import { ActiveUser } from './directives/user.directive';
import { Endpoint } from './directives/endpoint.directive';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = 'http://localhost:8080/users/'

  constructor(private httpClient: HttpClient) { }

  getUsers(token) {
    return this.httpClient.get<Response<ActiveUser[]>>(this.url, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + token)
    }).pipe(
      retry(1),
      catchError(handleError)
    )
  }

  updateProfile(surname, name, username, email, publicProfile, token) {
    return this.httpClient.put<Response<ActiveUser>>(this.url + username, {
      type: 'profile',
      surname,
      name,
      username,
      email,
      public: publicProfile
    }, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + token)
    }).pipe(
      catchError(handleError)
    )
  }

  changePassword(username, old_password, password, token) {
    return this.httpClient.put<Response<undefined>>(this.url + username, {
      type: 'password',
      old_password,
      password
    }, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + token)
    }).pipe(
      catchError(handleError)
    )
  }

  getEndpoints(username, token) {
    return this.httpClient.get<Response<Endpoint[]>>(this.url + username + '/endpoints', {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + token)
    }).pipe(
      retry(1),
      catchError(handleError)
    )
  }

  getSubscriptions(username, token) {
    return this.httpClient.get<Response<Endpoint[]>>(this.url + username + '/subscriptions', {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + token)
    }).pipe(
      retry(1),
      catchError(handleError)
    )
  }

  postSubscription(id, username, token) {
    return this.httpClient.post<Response<undefined>>(this.url + username + '/subscriptions', {
      endpoint: id
    }, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + token)
    }).pipe(
      catchError(handleError)
    )
  }

  deleteSubscription(id, username, token) {
    return this.httpClient.delete<Response<undefined>>(this.url + username + '/subscriptions?id=' + id, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + token)
    }).pipe(
      catchError(handleError)
    )
  }

  getFollowing(username, token) {
    return this.httpClient.get<Response<ActiveUser[]>>(this.url + username + '/following', {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + token)
    }).pipe(
      retry(1),
      catchError(handleError)
    )
  }

  postFollowing(username, followedUsername, token) {
    return this.httpClient.post<Response<undefined>>(this.url + username + '/following', {
      user: followedUsername
    }, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + token)
    }).pipe(
      catchError(handleError)
    )
  }

  deleteFollowing(username, followedUsername, token) {
    return this.httpClient.delete<Response<undefined>>(this.url + username + '/following?username=' + followedUsername, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + token)
    }).pipe(
      catchError(handleError)
    )
  }
}