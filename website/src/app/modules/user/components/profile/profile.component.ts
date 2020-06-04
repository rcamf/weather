import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/auth.service';
import { ActiveUser } from 'src/app/core/directives/user.directive';
import { matchValidator } from 'src/app/directives/match-validator.directive';
import { ParentErrorStateMatcher } from 'src/app/directives/parent-error-matcher.directive';
import { UserService } from 'src/app/core/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup
  passwordForm: FormGroup
  parentErrorStateMatcher = new ParentErrorStateMatcher
  user: ActiveUser
  loading = false
  loadingPassword = false

  constructor(private _authService: AuthService, private _userService: UserService) { }

  ngOnInit(): void {
    this.profileForm = new FormGroup({
      surname: new FormControl(''),
      name: new FormControl(''),
      username: new FormControl('', [
        Validators.required
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      public: new FormControl(true)
    })
    this.passwordForm = new FormGroup({
      oldPassword: new FormControl('', [
        Validators.required
      ]),
      password: new FormControl('', [
        Validators.pattern(/(?=.*\d).{8,}/),
        Validators.required
      ]),
      passwordConfirm: new FormControl('', [
        Validators.required
      ])
    }, {
      validators: matchValidator
    })
    this._authService.getUser().subscribe(
      user => {
        this.user = user
        this.profileForm.get('surname').setValue(user.surname)
        this.profileForm.get('name').setValue(user.name)
        this.profileForm.get('username').setValue(user.username)
        this.profileForm.get('email').setValue(user.email)
        this.profileForm.get('public').setValue(user.public)
      }
    )
  }

  updateProfile() {
    if (this.profileForm.valid) {
      this.loading = true
      this._userService.updateProfile(
        this.profileForm.get('surname').value || '',
        this.profileForm.get('name').value || '',
        this.profileForm.get('username').value,
        this.profileForm.get('email').value,
        this.profileForm.get('public').value,
        this.user.token
      ).subscribe(
        res => {
          this.user = {
            token: this.user.token,
            surname: res.data.surname,
            name: res.data.name,
            username: res.data.username,
            email: res.data.email,
            public: res.data.public,
            followers: res.data.followers,
            following: res.data.following
          }
          this.loading = false
        },
        error => {
          this.loading = false
          if (error.includes('Username')) {
            this.profileForm.get('username').setErrors({ usernameExists: true })
          } else {
            console.log(error)
          }
        }
      )
    }
  }

  changePassword() {
    if (this.passwordForm.valid) {
      this.loadingPassword = true
      this._userService.changePassword(this.user.username, this.passwordForm.get('oldPassword').value, this.passwordForm.get('password').value, this.user.token).subscribe(
        res => {
          this.loadingPassword = false
          this.passwordForm.reset()
          this.passwordForm.markAsPristine()
          this.passwordForm.markAsUntouched()
        },
        error => {
          this.loadingPassword = false
          if (error.includes('old password')) {
            this.passwordForm.get('oldPassword').setErrors({ incorrect: true })
          }
        }
      )
    }
  }

  getPasswordStrength() {
    const pw: string = this.passwordForm.get('password').value
    if (pw.match(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,-./:;<+>?@[\]^_`{|}~]).{12,}/))
      return 'Strongest'
    if (pw.match(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,-./:;<+>?@[\]^_`{|}~]).{8,}/)) 
      return 'Strong'
    if (pw.match(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/))
      return 'Medium'
    return 'Weak'
  }
}
