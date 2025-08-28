import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserAuthComponent } from './auth/user-auth/user-auth.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterAccordionComponent } from './shared/components/filter-accordion/filter-accordion.component';
import { MoviesDetailsComponent } from './shared/components/movies-details/movies-details.component';
import { CarouselModule } from "ngx-bootstrap/carousel";
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';

import { SearchBoxComponent } from './shared/components/searchBox/searchBox.component';
import { ErrorPageComponent } from './shared/components/error-page/error-page.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    UserAuthComponent,
    ErrorPageComponent,
    SearchBoxComponent

  ],
  imports: [BrowserModule,
    AppRoutingModule, NgbModule, ReactiveFormsModule, FormsModule, MoviesDetailsComponent, CarouselModule, FilterAccordionComponent, HttpClientModule],
  providers: [provideHttpClient(withFetch())],
  bootstrap: [AppComponent],
})
export class AppModule { }
