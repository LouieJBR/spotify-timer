import { Component } from '@angular/core';
import { SpotifyService } from '../spotify-service/spotify.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isLoggedIn: boolean = false; // Track the login state

  constructor(private spotifyService: SpotifyService) {}

  ngOnInit(): void {
    this.spotifyService.handleAuthCallback(); // Invoke the method to handle auth callback
    this.isLoggedIn = this.spotifyService.getToken() !== null; // Set login state on init
  }

  loginWithSpotify(): void {
    this.spotifyService.login();
  }

  logout(): void {
    this.spotifyService.logout();
    this.isLoggedIn = false; // Update the login state on logout
  }
}
