import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup
  loading = false

  constructor(private _authService: AuthService, private _router: Router, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', [
        Validators.required
      ]),
      password: new FormControl('', [
        Validators.required
      ])
    })
  }

  login() {
    if (this.loginForm.valid) {
      this.loading = true
      this._authService.login(this.loginForm.get('username').value, this.loginForm.get('password').value).subscribe(
        _res => {
          let url = this._authService.getRedirectUrl()
          this._authService.setRedirectUrl('')
          this._router.navigate([url])
        },
        _error => {
          this._snackBar.open('Invalid username or password', undefined, { duration: 2000 , verticalPosition: 'top'})
          this.loading = false
        }
      )
    } 
  }

  getErrorMessage(name) {
    if (this.loginForm.get(name).hasError('required')) {
      return 'You must enter a value'
    }
  }
}
