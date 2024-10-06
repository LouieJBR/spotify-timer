import { Component, Input, AfterViewInit } from '@angular/core';
import { Track, SpotifyService } from '../spotify-service/spotify.service';

declare var Spotify: any; // Declare the Spotify variable to avoid TypeScript errors

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: (() => void) | undefined;
    Spotify: any;
  }
}

@Component({
  selector: 'app-playback',
  standalone: true,
  templateUrl: './playback.component.html',
  styleUrls: ['./playback.component.css']
})
export class PlaybackComponent implements AfterViewInit {
  @Input() currentTrack: Track | null = null; // Current track to play
  @Input() isPlaying: boolean = false; // Playback state

  player: any; // Store Spotify player instance
  isPlayerReady: boolean = false; // Track if player is ready

  constructor(private spotifyService: SpotifyService) {}

  ngAfterViewInit() {
    window.onSpotifyWebPlaybackSDKReady = () => {
      this.player = new window.Spotify.Player({
        name: 'Spotify Web Player',
        getOAuthToken: (cb: any) => { cb(this.spotifyService.getToken()); },
        volume: 1.0
      });

      this.player.addListener('ready', ({ device_id }: any) => {
        console.log('Ready with Device ID', device_id);
        this.isPlayerReady = true; // Player is ready
      });

      this.player.addListener('not_ready', ({ device_id }: any) => {
        console.log('Device ID has gone offline', device_id);
        this.isPlayerReady = false; // Player is not ready anymore
      });

      this.player.addListener('initialization_error', ({ message }: any) => {
        console.error('Initialization error:', message);
      });

      this.player.addListener('authentication_error', ({ message }: any) => {
        console.error('Authentication error:', message);
      });

      this.player.addListener('account_error', ({ message }: any) => {
        console.error('Account error:', message);
      });

      this.player.addListener('playback_error', ({ message }: any) => {
        console.error('Playback error:', message);
      });

      this.player.connect().then((success: any) => {
        if (success) {
          console.log('Player connected successfully');
        } else {
          console.warn('Failed to connect to the player');
        }
      }).catch((error: any) => {
        console.error('Error connecting to the player:', error);
      });
    };

    // Load the Spotify SDK script asynchronously
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    document.body.appendChild(script);
  }

  // Play the current track
  async playCurrentTrack() {
    if (this.currentTrack) {
      if (this.isPlayerReady) {
        try {
          const state = await this.player.getCurrentState();
          if (state && state.track) {
            await this.spotifyService.playSong(this.currentTrack.uri);
            this.isPlaying = true;
          } else {
            console.warn('No active device found or the player is not ready.');
          }
        } catch (error) {
          console.error('Error playing current track:', error);
        }
      } else {
        console.warn('Player is not ready yet. Cannot play track.');
      }
    } else {
      console.warn('No current track selected to play.');
    }
  }

  // Pause playback
  async pausePlayback() {
    try {
      await this.spotifyService.pausePlayback();
      this.isPlaying = false;
    } catch (error) {
      console.error('Error pausing playback:', error);
    }
  }

  // Stop playback
  async stopPlayback() {
    await this.pausePlayback(); // Stop is essentially a pause in this case
  }

  // Play next track
  async nextTrack() {
    try {
      if (this.isPlayerReady) {
        await this.player.nextTrack(); // Use Spotify's nextTrack API
      } else {
        console.warn('Player is not ready yet. Cannot skip track.');
      }
    } catch (error) {
      console.error('Error skipping to next track:', error);
    }
  }
}
