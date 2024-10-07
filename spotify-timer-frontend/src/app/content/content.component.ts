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
  imports: [LoginComponent, TimerComponent, NgFor, NgIf, PlaybackComponent],
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent {
  playlists: { id: string; name: string }[] = [];
  selectedPlaylistTracks: Track[] = [];
  currentTrackIndex: number = -1;
  currentTrack: Track | null = null;
  isPlaying: boolean = false;

  constructor(private spotifyService: SpotifyService) {}

  ngOnInit(): void {
    this.loadUserPlaylists();
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
    const target = event.target as HTMLSelectElement;
    const selectedValue = target.value;
    await this.loadTracksFromSelectedPlaylists(selectedValue);
  }

  async loadTracksFromSelectedPlaylists(selectedValue: string) {
    this.selectedPlaylistTracks = await this.spotifyService.loadTracksFromPlaylist(selectedValue);
    // Remove auto playback
    if (this.selectedPlaylistTracks.length > 0) {
      this.currentTrackIndex = -1; // Reset the index
      this.currentTrack = null; // Clear current track
    }
  }

  // Method to start playback
  startPlayback() {
    this.loadNextTrack(); // Load the first track and play it
  }

  loadNextTrack() {
    if (this.selectedPlaylistTracks.length > 0 && this.currentTrackIndex < this.selectedPlaylistTracks.length - 1) {
      this.currentTrackIndex++;
      this.currentTrack = this.selectedPlaylistTracks[this.currentTrackIndex];
      this.playCurrentTrack();
    } else {
      console.log('No more tracks to play');
    }
  }

  async playCurrentTrack() {
    if (this.currentTrack) {
      await this.spotifyService.playSong(this.currentTrack.uri);
      this.isPlaying = true;
    }
  }

  async pausePlayback() {
    await this.spotifyService.pausePlayback();
    this.isPlaying = false;
  }

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
