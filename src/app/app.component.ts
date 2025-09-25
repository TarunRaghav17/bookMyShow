import { LoaderService } from './services/loader.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(public loaderService:LoaderService){

  }
  title = 'bookMyShow';
}
