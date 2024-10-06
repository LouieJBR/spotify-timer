// current-track.component.ts

import { Component, ContentChildren, Input } from '@angular/core';
import { Track, SpotifyService } from '../spotify-service/spotify.service';
import { NgFor, NgIf } from '@angular/common';
import { ContentComponent } from '../content/content.component';
@Component({
  selector: 'app-current-track',
  standalone: true,
  imports: [
    NgIf,
  ],
  templateUrl: './current-track.component.html',
  styleUrls: ['./current-track.component.css']
})
export class CurrentTrackComponent {
  @Input() tracks: Track[] = []; // Input property for tracks
  currentTrackIndex: number = -1; // Track index
  currentTrack: Track | null = null; // Current track information
  isPlaying: boolean = false; // Playback state

  constructor(private spotifyService: SpotifyService) {}

  get currentTrackArtists(): string {
    return this.currentTrack?.artists.map((artist: any) => artist.name).join(', ') || '';
  }

  ngOnInit() {
    console.log('Tracks:', this.tracks);
    if (this.tracks.length > 0) {
      this.loadNextTrack(); // Load the first track if available
    }
  }

  // Method to load the next track
  loadNextTrack() {
    if (this.tracks.length > 0 && this.currentTrackIndex < this.tracks.length - 1) {
      this.currentTrackIndex++;
      this.currentTrack = this.tracks[this.currentTrackIndex];
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
}
