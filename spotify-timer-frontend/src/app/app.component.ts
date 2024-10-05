import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'spotify-timer-frontend';
  constructor(private router: Router) {
    this.handleAuthCallback();
  }

  private handleAuthCallback() {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      if (accessToken) {
        // Store the access token (e.g., in local storage)
        localStorage.setItem('access_token', accessToken);
        console.log('Logged in successfully.')

        // Optionally navigate to another route
        this.router.navigate(['/']); // or any route you prefer
      }
    }
  }
}
