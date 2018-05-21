import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import NgxInputDateRangeModule from './modules/ngx-input-date-range/ngx-input-date-range.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    NgxInputDateRangeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
