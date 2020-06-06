import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { matchValidator } from 'src/app/directives/match-validator.directive';
import { ParentErrorStateMatcher } from 'src/app/directives/parent-error-matcher.directive';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup
  parentErrorStateMatcher = new ParentErrorStateMatcher
  loading = false

  constructor(private _authService: AuthService, private _router: Router, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      surname: new FormControl(''),
      name: new FormControl(''),
      username: new FormControl('', [
        Validators.required
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(/(?=.*\d).{8,}/)
      ]),
      passwordConfirm: new FormControl('', [
        Validators.required
      ])
    }, {
      validators: matchValidator
    })
  }

  signup() {
    if (this.signupForm.valid) {
      this.loading = true
      this._authService.signup(
        this.signupForm.get('username').value,
        this.signupForm.get('name').value,
        this.signupForm.get('surname').value,
        this.signupForm.get('email').value,
        this.signupForm.get('password').value
      ).subscribe(
        _res => {
          let url = this._authService.getRedirectUrl()
          this._authService.setRedirectUrl('')
          this._router.navigate([url])
        },
        _error => {
          this._snackBar.open('The provided values are bad', undefined, { duration: 2000, verticalPosition: 'top' }),
          this.loading = false
        }
      )
    }
  }

  getPasswordStrength() {
    const pw: string = this.signupForm.get('password').value
    if (pw.match(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,-./:;<+>?@[\]^_`{|}~]).{12,}/))
      return 'Strongest'
    if (pw.match(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,-./:;<+>?@[\]^_`{|}~]).{8,}/)) 
      return 'Strong'
    if (pw.match(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/))
      return 'Medium'
    return 'Weak'
  }
}
