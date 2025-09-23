import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private toastrService: ToastrService) { }

  /**
   * @description expectedRole variable get role 
   * @author Gurmeet Kumar
   */

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['role'];
    const userRole = this.authService.getUserRole();

    if (this.authService.isLoggedIn() && userRole === expectedRole) {
      return true;
    }

    /**
      * @description role doesn't match to get the toastr unauthorized 
      * @author Gurmeet Kumar
      */

    this.toastrService.error('You are not authorized to access this page', 'Unauthorized');
    this.router.navigate(['/']);
    return false;
  }
}
