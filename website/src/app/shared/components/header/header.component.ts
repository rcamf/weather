import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private authService: AuthService, private _router: Router) {
    
  }

  ngOnInit(): void {
  }

  isActiveUser() {
    return this.authService.isActiveUser()
  }

  logout() {
    this._router.navigate(['/'])
    this.authService.logout()
  }
}
