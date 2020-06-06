import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor(private _authService: AuthService) { }

  ngOnInit(): void {
  }

  logout() {
    this._authService.logout()
  }
}
