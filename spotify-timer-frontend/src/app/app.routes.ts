import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    { path: '/login', component: LoginComponent },
    // You can add more routes here
    // { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirect to /login on empty path
]