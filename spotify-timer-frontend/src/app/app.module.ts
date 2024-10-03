import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { LoginComponent } from "./login/login.component"; // Import the login component
import { routes } from './app.routes';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
    // Add other components here
  ],
  imports: [
    BrowserModule,
    routes // Add routing module here
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
