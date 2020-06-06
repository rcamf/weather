import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { UserService } from 'src/app/core/user.service';
import { ActiveUser } from 'src/app/core/directives/user.directive';
import { Subscription, interval, Observable } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  user: ActiveUser
  users: ActiveUser[]
  following: ActiveUser[]
  userRefreshInterval: Subscription

  constructor(private _authService: AuthService, private _userService: UserService) { }

  ngOnInit(): void {
    this._authService.getUser().subscribe(
      user => {
        this.user = user
        this._userService.getUsers(user.token).subscribe(
          response => this.users = response.data,
          error => console.log(error)
        )
        this._userService.getFollowing(user.username, user.token).subscribe(
          response => this.following = response.data,
          error => console.log(error)
        )
      }
    )
    this.userRefreshInterval = interval(60000).subscribe(
      () => this._userService.getUsers(this.user.token).subscribe(
        response => this.users = response.data,
        error => console.log(error)
      )
    )
  }

  isFollowing(user) {
    return this.following.filter(follow => follow.username === user.username).length > 0
  }

  changeFollowing(user) {
    if (this.isFollowing(user)) {
      this._userService.deleteFollowing(this.user.username, user.username, this.user.token).subscribe(
        deletion => this._userService.getFollowing(this.user.username, this.user.token).subscribe(
          response => this.following = response.data,
          error => console.log(error)
        ),
        error => console.log(error)
      )
    } else {
      this._userService.postFollowing(this.user.username, user.username, this.user.token).subscribe(
        creation => this._userService.getFollowing(this.user.username, this.user.token).subscribe(
          response => this.following = response.data,
          error => console.log(error)
        ), 
        error => console.log(error)
      )
    }
  }

  ngOnDestroy() {
    this.userRefreshInterval.unsubscribe()
  }
}