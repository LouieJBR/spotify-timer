import { Component } from '@angular/core';

@Component({
  selector: 'app-timer',
  standalone: true,
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent {
  displayTime = '00:00'; // Displayed timer time
  totalSeconds = 0; // Total seconds in timer
  timerInterval: ReturnType<typeof setInterval> | undefined; // Type for cross-environment compatibility
  isRunning = false; // To track if the timer is running

  // Update time based on user input
  updateTime(event: Event): void {
    const input = (event.target as HTMLElement).innerText; // Get the input from innerText
    const timeParts = input.split(':');

    if (timeParts.length === 2) {
      const minutes = parseInt(timeParts[0], 10);
      const seconds = parseInt(timeParts[1], 10);

      // Check if the input is valid
      if (!isNaN(minutes) && !isNaN(seconds)) {
        this.totalSeconds = minutes * 60 + seconds;
        this.displayTime = this.formatTime(this.totalSeconds);
      }
    }
  }

  // Handle keyboard events for 'Enter' and 'Escape' keys
  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent newline character
      this.startTimer();
    } else if (event.key === 'Escape') {
      (event.target as HTMLElement).blur(); // Unfocus input
    }
  }

  // Increment the time
  incrementTime(seconds: number): void {
    this.totalSeconds += seconds;
    this.displayTime = this.formatTime(this.totalSeconds);
  }

  // Decrement the time
  decrementTime(seconds: number): void {
    this.totalSeconds = Math.max(0, this.totalSeconds - seconds); // Prevent negative time
    this.displayTime = this.formatTime(this.totalSeconds);
  }

  // Start the timer logic
  startTimer(): void {
    if (this.isRunning) return; // Prevent starting if already running

    this.isRunning = true; // Set timer as running
    this.timerInterval = setInterval(() => {
      if (this.totalSeconds > 0) {
        this.totalSeconds--;
        this.displayTime = this.formatTime(this.totalSeconds);
      } else {
        this.stopTimer(); // Stop when it reaches zero
      }
    }, 1000); // Update every second
  }

  // Stop the timer logic
  stopTimer(): void {
    clearInterval(this.timerInterval); // Clear the interval
    this.isRunning = false; // Reset running status
    console.log('Timer stopped!'); // Optional: log when timer stops
  }

  // Reset the timer
  resetTimer(): void {
    this.stopTimer(); // Ensure timer is stopped
    this.totalSeconds = 0; // Reset to zero
    this.displayTime = this.formatTime(this.totalSeconds); // Update display
  }

  // Format time in MM:SS format
  formatTime(totalSeconds: number): string {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  }
}
