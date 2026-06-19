import { Component } from '@angular/core';
import { NavigationStart, Router, RouterOutlet } from '@angular/router';
import { environment } from '../enviroments/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  schemas: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor () {
    console.log(environment.apiUrl);
  }
}
