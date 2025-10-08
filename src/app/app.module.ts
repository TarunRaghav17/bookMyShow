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
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchBoxComponent } from './shared/components/searchBox/searchBox.component';
import { ErrorPageComponent } from './shared/components/error-page/error-page.component';
import { TheatreListComponent } from './shared/components/theatre-list/theatre-list.component';
import { AuthInterceptor } from './auth/interceptor/auth.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { EventsDetailsComponent } from './shared/components/events-details/events-details.component';
import { CommonModule } from '@angular/common';
import { BookingEventsComponent } from './shared/components/booking-events/booking-events.component';
import { DurationPipe } from './core/pipes/duration.pipe';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ErrorPageComponent,
    SearchBoxComponent,
    TheatreListComponent,
    BookingEventsComponent,
  ],
  imports: [BrowserModule, BrowserAnimationsModule,
    AppRoutingModule, NgbModule, ReactiveFormsModule, FormsModule, MoviesDetailsComponent, CarouselModule,
    FilterAccordionComponent, HttpClientModule, UserAuthComponent, EventsDetailsComponent, CommonModule,DurationPipe,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
  ],
  providers: [
    provideHttpClient(withFetch()),

    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
  ,
  bootstrap: [AppComponent],
})
export class AppModule { }
