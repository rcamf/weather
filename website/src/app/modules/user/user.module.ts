import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedModule } from 'src/app/shared/shared.module';
import { EndpointsComponent } from './components/endpoints/endpoints.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SubscriptionsComponent } from './components/subscriptions/subscriptions.component';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { CreateEndpointDialogComponent } from './components/create-endpoint-dialog/create-endpoint-dialog.component';

@NgModule({
  declarations: [UserComponent, EndpointsComponent, SubscriptionsComponent, ProfileComponent, CreateEndpointDialogComponent],
  imports: [
    UserRoutingModule,
    SharedModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatDialogModule
  ]
})
export class UserModule { }
