import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedInAuthGuard implements CanActivate {
  constructor(private _authService: AuthService, private _router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this._authService.isActiveUser()) {
      this._router.navigate(['/'])
      return false
    }
    return true
  }
}