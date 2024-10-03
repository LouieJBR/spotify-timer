import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private CLIENT_ID = environment.SPOTIFY_CLIENT_ID; // Replace with your actual client ID
  private REDIRECT_URI = environment.SPOTIFY_REDIRECT_URI; // Change to your actual redirect URI
  private SCOPES = environment.SPOTIFY_SCOPES;

  constructor() {}

  public login() {
    const SPOTIFY_AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${this.CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(this.REDIRECT_URI)}&scope=${encodeURIComponent(this.SCOPES)}`;
    window.location.href = SPOTIFY_AUTH_URL;
  }
}
