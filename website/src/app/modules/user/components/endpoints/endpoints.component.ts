import { Component, OnInit } from '@angular/core';
import { Endpoint } from 'src/app/core/directives/endpoint.directive';
import { AuthService } from 'src/app/core/auth.service';
import { UserService } from 'src/app/core/user.service';
import { ActiveUser } from 'src/app/core/directives/user.directive';
import { EndpointService } from 'src/app/core/endpoint.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateEndpointDialogComponent } from '../create-endpoint-dialog/create-endpoint-dialog.component';

@Component({
  selector: 'app-endpoints',
  templateUrl: './endpoints.component.html',
  styleUrls: ['./endpoints.component.scss']
})
export class EndpointsComponent implements OnInit {
  endpoints: Endpoint[]
  user: ActiveUser

  constructor(private _authService: AuthService, private _userService: UserService, private _endpointService: EndpointService, private _dialog: MatDialog) { }

  ngOnInit(): void {
    this._authService.getUser().subscribe(
      user => {
        this.user = user
        this._userService.getEndpoints(user.username, user.token).subscribe(
          res => this.endpoints = res.data,
          error => console.log(error)
        )
      }
    )
  }

  openDialog() {
    const dialogRef = this._dialog.open(CreateEndpointDialogComponent, {
      data: { token: this.user.token }
    })
    dialogRef.afterClosed().subscribe(result =>
      this._userService.getEndpoints(this.user.username, this.user.token).subscribe(
        res => this.endpoints = res.data,
        error => console.log(error)
      ),
    )
  }

  delete(endpoint: Endpoint) {
    this._endpointService.deleteEndpoint(endpoint.id, this.user.token).subscribe(
      deletion => this._userService.getEndpoints(this.user.username, this.user.token).subscribe(
        res => this.endpoints = res.data,
        error => console.log(error)
      ),
      error => console.log(error)
    )
  }
}
