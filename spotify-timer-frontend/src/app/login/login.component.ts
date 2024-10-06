import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../spotify-service/spotify.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoggedIn = false; // Track the login state
  displayName: string | null = null; // Property to store the user's display name
  isHovered = false; // New property for hover state

  constructor(private spotifyService: SpotifyService) {}

  ngOnInit(): void {
    this.spotifyService.handleAuthCallback(); // Invoke the method to handle auth callback
    this.isLoggedIn = this.spotifyService.getToken() !== null; // Set login state on init
   
    if (this.isLoggedIn) {
      this.getUserInfo(); // Fetch user info if logged in
      this.getUserPlaylists();
    }
  }

  async getUserInfo(): Promise<void> {
    try {
      const userInfo = await this.spotifyService.getUserInfo();
      this.displayName = userInfo.display_name; // Store the display name
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  }

  async getUserPlaylists(): Promise<void> {
    try {
      const userPlaylists = await this.spotifyService.getUserPlaylists();
      console.log('User playlists:', userPlaylists);
    } catch (error) {
      console.error('Error fetching user playlists:', error);
    }
  }

  loginWithSpotify(): void {
    this.spotifyService.login();
  }

  logout(): void {
    this.spotifyService.logout();
    this.isLoggedIn = false; // Update the login state on logout
  }
  
}
