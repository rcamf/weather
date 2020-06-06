import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartsModule } from 'ng2-charts';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexComponent } from './components/index/index.component';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { SharedModule } from './shared/shared.module';
import { UserComponent } from './components/user/user.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    IndexComponent,
    LineChartComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    ChartsModule,
    MatTabsModule,
    MatExpansionModule,
    MatListModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
