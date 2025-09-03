import { ToastrService } from 'ngx-toastr';
// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../auth-service.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private toastrService: ToastrService) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['role'];  //  role route se aayega
    const userRole = this.authService.getUserRole();

    if (this.authService.isLoggedIn() && userRole === expectedRole) {
      return true;
    }

    // Agar role match nahi karta toh unauthorized page pe bhej do
    this.toastrService.error('You are not authorized to access this page', 'Unauthorized');
    this.router.navigate(['/']);
    return false;
  }
}
