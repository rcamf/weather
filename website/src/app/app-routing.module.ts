import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { IndexComponent } from './components/index/index.component';
import { LoggedInAuthGuard } from './core/logged-in-auth.guard';
import { UserComponent } from './components/user/user.component';
import { AuthGuard } from './core/auth.guard';


const routes: Routes = [
  { path: 'user', loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule) },
  { path: 'endpoints', loadChildren: () => import('./modules/endpoints/endpoints.module').then(m => m.EndpointsModule) },
  { path: 'users', component: UserComponent, canActivate: [ AuthGuard ]},
  { path: 'login', component: LoginComponent, canActivate: [ LoggedInAuthGuard ] },
  { path: 'signup', component: SignupComponent, canActivate: [ LoggedInAuthGuard ] },
  { path: '', pathMatch: 'full', component: IndexComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
