import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedModule } from 'src/app/shared/shared.module';
import { EndpointsRoutingModule } from './endpoints-routing.module';
import { EndpointsComponent } from './endpoints.component';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
  declarations: [EndpointsComponent],
  imports: [
    CommonModule,
    EndpointsRoutingModule,
    MatExpansionModule,
    SharedModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ]
})
export class EndpointsModule { }
