import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { UserService } from 'src/app/core/user.service';
import { EndpointService } from 'src/app/core/endpoint.service';
import { Endpoint } from 'src/app/core/directives/endpoint.directive';
import { ActiveUser } from 'src/app/core/directives/user.directive';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {
  endpoints: Endpoint[]
  user: ActiveUser

  constructor(private _authService: AuthService, private _userService: UserService, private _endpointService: EndpointService) { }

  ngOnInit(): void {
    this._authService.getUser().subscribe(
      user => {
        this.user = user
        this._userService.getSubscriptions(user.username, user.token).subscribe(
          res => this.endpoints = res.data,
          error => console.log(error)
        )
      }
    )
  }

  unsubscribe(endpoint: Endpoint) {
    this._userService.deleteSubscription(endpoint.id, this.user.username, this.user.token).subscribe(
      res => this._userService.getSubscriptions(this.user.username, this.user.token).subscribe(
        res => this.endpoints = res.data,
        error => console.log(error)
      ),
      error => console.log(error)
    )
  }
}
