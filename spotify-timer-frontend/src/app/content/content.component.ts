import { Component } from '@angular/core';
import { TimerComponent } from '../timer/timer.component';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-content',
  imports: [LoginComponent, TimerComponent],
  standalone: true,
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent {

}
