import { Component } from '@angular/core';
import { ContentComponent } from '../content/content.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [ContentComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {

}
