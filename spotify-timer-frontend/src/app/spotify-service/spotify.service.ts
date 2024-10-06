import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface SpotifyUser {
  display_name: string;
  email: string;
  id: string;
}

export interface Track {
  uri: string;
  name: string;
  album: string
  artists: { name: string }[];
}

export interface PlaybackState {
  is_playing: boolean;
  item: Track;
  device: {
    id: string;
    name: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private accessToken: string | null = null;

  constructor() {
    this.accessToken = localStorage.getItem('access_token');
  }

  login(): void {
    const spotifyAuthUrl = 
      `https://accounts.spotify.com/authorize?client_id=${environment.SPOTIFY_CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(environment.SPOTIFY_REDIRECT_URI)}&scope=${encodeURIComponent(environment.SPOTIFY_SCOPES)}`;
    window.location.href = spotifyAuthUrl;
  }

  logout(): void {
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
        localStorage.setItem('access_token', accessToken);
        this.accessToken = accessToken;
      }
    }
  }

  async getUserInfo(): Promise<SpotifyUser | null> {
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch user info');
      return await response.json();
    } catch (error) {
      console.error('Error fetching user info:', error);
      return null;
    }
  }

  async getUserPlaylists(): Promise<{ id: string; name: string }[]> {
    try {
      const response = await fetch('https://api.spotify.com/v1/me/playlists', {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch playlists');
      const data = await response.json();
      return data.items.map((playlist: { id: string; name: string }) => ({
        id: playlist.id,
        name: playlist.name
      }));
    } catch (error) {
      console.error('Error fetching playlists:', error);
      return [];
    }
  }

  async loadTracksFromPlaylist(playlistId: string): Promise<Track[]> {
    try {
      const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch playlist tracks');
      
      const data = await response.json();
      return data.items.map((item: any) => ({
        uri: item.track.uri,
        name: item.track.name,
        album: item.track.album.name,
        artists: item.track.artists
      }));
    } catch (error) {
      console.error('Error loading tracks:', error);
      return []; // Return empty array on error
    }
  }
  async getPlaybackState(): Promise<PlaybackState | null> {
    try {
      const response = await fetch('https://api.spotify.com/v1/me/player', {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch playback state');
      return await response.json();
    } catch (error) {
      console.error('Error fetching playback state:', error);
      return null;
    }
  }

  async playSong(songUri: string): Promise<void> {
    const token = this.getToken();
    if (!token) {
      this.login();
      return;
    }
    
    try {
      const response = await fetch('https://api.spotify.com/v1/me/player/play', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uris: [songUri] }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error playing song:', errorData);
        if (errorData.status === 401) {
          this.login(); // Token expired or invalid, redirect to login
        }
      }
    } catch (error) {
      console.error('Error playing song:', error);
    }
  }
  

  async pausePlayback(): Promise<void> {
    try {
      await fetch('https://api.spotify.com/v1/me/player/pause', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });
    } catch (error) {
      console.error('Error pausing playback:', error);
    }
  }
}
