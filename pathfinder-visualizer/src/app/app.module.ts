import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { AppRoutingModule } from './app-routing.module';
import { MatSelectModule } from '@angular/material/select';
import { AppComponent } from './app.component';
import { SquareComponent } from './components/square/square.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GraphService } from './services/graph.service';
import { ToastrModule } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon'

@NgModule({
  declarations: [
    AppComponent,
    SquareComponent
  ],
  imports: [
    BrowserModule,
    MatIconModule,
    AppRoutingModule,
    MatMenuModule,
    MatButtonModule,
    MatSelectModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
  ],

  providers: [GraphService],
  bootstrap: [AppComponent]
})
export class AppModule { }
