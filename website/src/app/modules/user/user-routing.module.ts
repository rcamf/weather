import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserComponent } from './user.component';
import { EndpointsComponent } from './components/endpoints/endpoints.component';
import { SubscriptionsComponent } from './components/subscriptions/subscriptions.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthGuard } from 'src/app/core/auth.guard';

const routes: Routes = [
  { 
    path: '', component: UserComponent, canActivate: [ AuthGuard ],
    children: [
      
      { path: '', component: ProfileComponent },
      { path: 'endpoints', component: EndpointsComponent },
      { path: 'subscriptions', component: SubscriptionsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
