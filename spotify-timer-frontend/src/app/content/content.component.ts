// content.component.ts

import { Component } from '@angular/core';
import { TimerComponent } from '../timer/timer.component';
import { LoginComponent } from '../login/login.component';
import { SpotifyService } from '../spotify-service/spotify.service';
import { NgFor } from '@angular/common';
import { CurrentTrackComponent } from '../current-track/current-track.component';
import { Track } from '../spotify-service/spotify.service';
@Component({
  selector: 'app-content',
  standalone: true,
  imports: [LoginComponent, TimerComponent, NgFor, CurrentTrackComponent], // Ensure all are standalone  standalone: true,
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent {
  playlists: { id: string; name: string }[] = [];
  selectedPlaylistTracks: Track[] = []; // To store the selected playlist tracks

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
    console.log(selectedValue);
    // Now load the tracks for the selected playlist
    await this.loadTracksFromSelectedPlaylists(selectedValue);}

async loadTracksFromSelectedPlaylists(selectedValue: string) {
  this.selectedPlaylistTracks = await this.spotifyService.loadTracksFromPlaylist(selectedValue);
  console.log("LoadedPlaylistTracks:", this.selectedPlaylistTracks);
}
  
}
