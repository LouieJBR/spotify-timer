import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  private accessToken: string | null = null;

  constructor() { 
    this.accessToken = localStorage.getItem('access_token');
  }

  login():void {
    const spotifyAuthUrl = 
    `https://accounts.spotify.com/authorize?client_id=${environment.SPOTIFY_CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(environment.SPOTIFY_REDIRECT_URI)}&scope=${encodeURIComponent(environment.SPOTIFY_SCOPES)}`;
    window.location.href = spotifyAuthUrl;
  }

  logout():void {
    localStorage.removeItem('access_token');
    window.location.href = 'https://accounts.spotify.com/en/logout';
  }

  getToken(): string | null {
    return this.accessToken;
  }

  handleAuthCallback(): void {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      if (accessToken) {
        // Store the access token
        localStorage.setItem('access_token', accessToken);
        this.accessToken = accessToken;
      }
    }
  }

  async getPlaybackState(): Promise<any> {
    const response = await fetch('https://api.spotify.com/v1/me/player', {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      }
    });
    return response.json();
  }

// Method to play a song on Spotify
async playSong(songUri: string): Promise<any> {
  const response = await fetch('https://api.spotify.com/v1/me/player/play', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ uris: [songUri] }),
  });
  return response.json();
}

// Pause playback
async pausePlayback(): Promise<any> {
  const response = await fetch('https://api.spotify.com/v1/me/player/pause', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${this.accessToken}`,
    },
  });
  return response;
}
}
