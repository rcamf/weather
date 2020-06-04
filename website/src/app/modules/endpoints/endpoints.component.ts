import { Component, OnInit } from '@angular/core';
import { EndpointService } from 'src/app/core/endpoint.service';
import { interval, Subscription } from 'rxjs';
import { Endpoint } from 'src/app/core/directives/endpoint.directive';
import { UserService } from 'src/app/core/user.service';
import { AuthService } from 'src/app/core/auth.service';
import { ActiveUser } from 'src/app/core/directives/user.directive';

@Component({
  selector: 'app-endpoints',
  templateUrl: './endpoints.component.html',
  styleUrls: ['./endpoints.component.scss']
})
export class EndpointsComponent implements OnInit {
  endpoints: Endpoint[]
  subscriptions: Endpoint[]
  user: ActiveUser
  endpointRefreshInterval: Subscription

  constructor(private _endpointService: EndpointService, private _authService: AuthService, private _userService: UserService) { }

  ngOnInit(): void {
    this._endpointService.getEndpoints().subscribe(
      res => this.endpoints = res.data
    )
    this._authService.getUser().subscribe(
      user => {
        this.user = user
        if (user) {
          this._userService.getSubscriptions(user.username, user.token).subscribe(
            res => this.subscriptions = res.data,
            error => console.log(error)
          )
        }
      }
    )
    this.endpointRefreshInterval = interval(60000).subscribe(
      () => {
        this._endpointService.getEndpoints().subscribe(
          res => this.endpoints = res.data
        )
      }
    )
  }

  isSubscribed(endpoint) {
    return this.subscriptions.filter(sub => sub.id === endpoint.id).length > 0
  }

  changeSubscription(endpoint) {
    if (this.isSubscribed(endpoint)) {
      this._userService.deleteSubscription(endpoint.id, this.user.username, this.user.token).subscribe(
        deletion => this._userService.getSubscriptions(this.user.username, this.user.token).subscribe(
          res => this.subscriptions = res.data,
          error => console.log(error)
        ),
        error => console.log(error)
      )
    } else {
      this._userService.postSubscription(endpoint.id, this.user.username, this.user.token).subscribe(
        creation => this._userService.getSubscriptions(this.user.username, this.user.token).subscribe(
          res => this.subscriptions = res.data,
          error => console.log(error)
        ),
        error => console.log(error)
      )
    }
  }

  ngOnDestroy() {
    this.endpointRefreshInterval.unsubscribe()
  }
}
