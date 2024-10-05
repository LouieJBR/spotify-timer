import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../spotify-service/spotify.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {
  timeInSeconds: number = 600; // 10 minutes as an example
  timer: any;

  constructor(private spotifyService: SpotifyService) {}

  ngOnInit(): void {}

  // Start the timer and play a song
  startTimer(): void {
    const songUri = 'spotify:track:your_song_uri'; // Replace with an actual Spotify URI
    this.spotifyService.playSong(songUri).then(() => {
      this.timer = setInterval(() => {
        this.timeInSeconds--;
        if (this.timeInSeconds <= 0) {
          this.stopTimer();
        }
      }, 1000);
    });
  }

  // Stop the timer and pause Spotify playback
  stopTimer(): void {
    clearInterval(this.timer);
    this.spotifyService.pausePlayback();
  }
}
