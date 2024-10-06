import { Component } from '@angular/core';
import { TimerComponent } from '../timer/timer.component';
import { LoginComponent } from '../login/login.component';
import { SpotifyService } from '../spotify-service/spotify.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-content',
  imports: [LoginComponent, TimerComponent, NgFor],
  standalone: true,
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent {
  playlists: string[] = [];

  constructor(private spotifyService: SpotifyService) {}

  ngOnInit(): void {
    this.loadUserPlaylists();
  }

  async loadUserPlaylists(){
    try {
      this.playlists = await this.spotifyService.getUserPlaylists();
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }}
  }
