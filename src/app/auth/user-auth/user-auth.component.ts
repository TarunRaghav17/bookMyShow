import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth-service.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs';
import { debounceTime } from 'rxjs';

/**
 * @description Component for user authentication (login & signup modal)
 * @author Gurmeet Kumar
 */
@Component({
  selector: 'app-user-auth',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.scss']
})
export class UserAuthComponent implements OnInit {
  isUsernameAvailable: any;
  openSignupForm: boolean = false;
  showPassword: boolean = false;
  showMessageFlag: any;
  constructor(public authService: AuthService, private activeModal: NgbActiveModal, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.onValidateExistUser();
  }
  /** @description Login form controls */
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });
  /** @description Signup form controls */
  signupForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(15), Validators.pattern(/^[A-Za-z0-9_]+$/)]),
    email: new FormControl('', [Validators.required, Validators.pattern(/^(?![._-])[A-Za-z0-9._-]+(?<![._-])@(?:(?!-)[A-Za-z-]+(?<!-)\.)+[A-Za-z]{2,}$/)]),
    phoneNumber: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(15), Validators.pattern(/^[0-9]+$/)]),
    roleName: new FormControl('USER', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=(?:[^@$^&*%]*[@$^&*%][^@$^&*%]*$))[A-Za-z\d@$^&*%]{8,20}$/)])
  });

  /**
   * @description Handle login form submit, encrypt password, store token, update signal, close modal
   * @author Gurmeet Kumar
   * @return void
   */
  onLoginSubmit(): void {
    if (this.loginForm.valid) {
      const encryptedData = {
        ...this.loginForm.value,
        password: this.authService.encryptUsingAES256(this.loginForm.value.password)
      };
      this.authService.login(encryptedData).subscribe({
        next: (res: any) => {
          this.toastr.success(res.message)
          localStorage.setItem('token', res.data.token);
          this.authService.userDetailsSignal.set(
            this.authService.decodeToken(res.data.token)
          );
          this.loginForm.reset();
          this.activeModal.close(UserAuthComponent);
        },
        error: (err) =>
          this.toastr.error(err.message)
      });
    }
  }

  /**
   * @description Handle signup form submit, encrypt password, call API, close modal on success
   * @author Gurmeet Kumar
   * @return void
   */
  onSignupSubmit(): void {
    if (this.signupForm.valid) {
      const encryptedData = {
        ...this.signupForm.value,
        password: this.authService.encryptUsingAES256(this.signupForm.value.password)
      };
      this.authService.signup(encryptedData).subscribe({
        next: () => {
          this.signupForm.reset();
          this.activeModal.close(UserAuthComponent);
        },
        error: (err) =>
          this.toastr.error(err.message)
      });
    }
  }

  /**
   * @description Toggle show/hide password field in forms
   * @author Gurmeet Kumar
   * @return void
   */
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * @description Toggle between login and signup forms
   * @author Gurmeet Kumar
   * @return void
   */
  toggleSignupForm(): void {
    this.openSignupForm = !this.openSignupForm;
  }

  /**
 * @description userName validate here to Exist here or not 
 * @author Gurmeet Kumar
 * @return void
 * @param event
 */


  onValidateExistUser(): void {
    const usernameControl = this.signupForm.get('username');
    if (!usernameControl) {
      return;
    }
    usernameControl.valueChanges.pipe(
      filter((val): val is string => val !== null),
      debounceTime(200),
      map((val) => val.trim()),
      distinctUntilChanged(),
      switchMap((username: string) =>
        this.authService.validateUserName(username))
    ).subscribe({
      next: (res: any) => {
        this.isUsernameAvailable = res.message;
        this.showMessageFlag = res.success
      },
      error: (err) => {
        this.toastr.error(err.message || 'Validation failed');
      }
    });
  }

}
