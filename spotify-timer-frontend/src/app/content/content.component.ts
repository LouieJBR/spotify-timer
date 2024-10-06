import { Component } from '@angular/core';
import { TimerComponent } from '../timer/timer.component';
import { LoginComponent } from '../login/login.component';
import { SpotifyService } from '../spotify-service/spotify.service';
import { NgFor, NgIf } from '@angular/common';
import { Track } from '../spotify-service/spotify.service';
import { PlaybackComponent } from '../playback/playback.component';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [LoginComponent, TimerComponent, NgFor, NgIf, PlaybackComponent], // Remove CurrentTrackComponent from imports
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent {
  playlists: { id: string; name: string }[] = [];
  selectedPlaylistTracks: Track[] = []; // To store the selected playlist tracks
  currentTrackIndex: number = -1; // Track index
  currentTrack: Track | null = null; // Current track information
  isPlaying: boolean = false; // Playback state

  constructor(private spotifyService: SpotifyService) {}

  ngOnInit(): void {
    this.loadUserPlaylists();
    console.log(this.playlists);
  }

  async loadUserPlaylists() {
    try {
      const playlists = await this.spotifyService.getUserPlaylists();
      this.playlists = playlists.map(playlist => ({ id: playlist.id, name: playlist.name }));
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  }

  async onPlaylistSelect(event: Event) {
    const target = event.target as HTMLSelectElement; // Cast the event target to HTMLSelectElement
    const selectedValue = target.value; // Get the selected value
    // Now load the tracks for the selected playlist
    await this.loadTracksFromSelectedPlaylists(selectedValue);
  }

  async loadTracksFromSelectedPlaylists(selectedValue: string) {
    this.selectedPlaylistTracks = await this.spotifyService.loadTracksFromPlaylist(selectedValue);
    if (this.selectedPlaylistTracks.length > 0) {
      this.loadNextTrack(); // Load the first track if available
    }
  }

  // Method to load the next track
  loadNextTrack() {
    if (this.selectedPlaylistTracks.length > 0 && this.currentTrackIndex < this.selectedPlaylistTracks.length - 1) {
      this.currentTrackIndex++;
      this.currentTrack = this.selectedPlaylistTracks[this.currentTrackIndex];
      this.playCurrentTrack();
    } else {
      console.log('No more tracks to play');
    }
  }

  // Method to play the current track
  async playCurrentTrack() {
    if (this.currentTrack) {
      await this.spotifyService.playSong(this.currentTrack.uri);
      this.isPlaying = true;
    }
  }

  // Method to pause playback
  async pausePlayback() {
    await this.spotifyService.pausePlayback();
    this.isPlaying = false;
  }

  // Method to handle Next button click
  onNext() {
    this.loadNextTrack();
  }

  get currentTrackArtists(): string {
    return this.currentTrack?.artists.map((artist: any) => artist.name).join(', ') || '';
  }
get currentTrackAlbum(): string {
  return this.currentTrack?.album || '';
}
}