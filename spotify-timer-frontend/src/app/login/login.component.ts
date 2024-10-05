import { Component } from '@angular/core';
import { SpotifyService } from '../spotify-service/spotify.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private spotifyService: SpotifyService) {}

  ngOnInit(): void {
    this.spotifyService.handleAuthCallback;
  }


  loginWithSpotify(): void {
    this.spotifyService.login();
  }
}
