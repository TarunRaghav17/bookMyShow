import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { SearcboxComponent } from './shared/components/searcbox/searcbox.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserAuthComponent } from './auth/user-auth/user-auth.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorpageComponent } from './shared/components/erorpage/errorpage.component';
import { FilterAccordianComponent } from './shared/components/filter-accordian/filter-accordian.component';
import { MoviesDetailsComponent } from './shared/components/movies-details/movies-details.component';
import { CarouselModule } from "ngx-bootstrap/carousel";
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SearcboxComponent,
    UserAuthComponent,
    ErrorpageComponent,

  ],
  imports: [BrowserModule, AppRoutingModule, NgbModule, ReactiveFormsModule, FormsModule, FilterAccordianComponent, MoviesDetailsComponent, CarouselModule, HttpClientModule],
  providers: [provideHttpClient(withFetch())],
  bootstrap: [AppComponent],
})
export class AppModule { }
