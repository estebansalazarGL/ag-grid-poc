import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AgGridModule } from 'ag-grid-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CellButtonComponent } from './components/cell-button/cell-button.component';

@NgModule({
  declarations: [
    AppComponent,
    CellButtonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AgGridModule.withComponents([
      CellButtonComponent
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
