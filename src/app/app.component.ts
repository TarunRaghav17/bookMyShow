import { Title } from '@angular/platform-browser';
import { LoaderService } from './services/loader.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(public loaderService:LoaderService,
    private titleService:Title

  ){

  }

  ngOnInit(): void {
    this.titleService.setTitle('Book-My-Show');
  }
  title = 'bookMyShow';
}
