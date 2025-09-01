import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth-service.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-auth',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.scss']
})
export class UserAuthComponent implements OnInit {

  openSignupForm: boolean = false;
  showPassword: boolean = false;

  constructor(private authService: AuthService, private activeModal: NgbActiveModal) { }
  ngOnInit(): void { }

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  signupForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9]{10}$/)
    ]),
    roleName: new FormControl("USER", Validators.required),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });


  onLoginSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe((res) => {
        alert(res.message);
        localStorage.setItem('token', res.content);
        this.authService.userDetailsSignal.set(this.authService.decodeToken(res.content));
        this.loginForm.reset();
        this.activeModal.close(UserAuthComponent);
      });
    }
  }


  onSignupSubmit() {
    if (this.signupForm.valid) {
      this.authService.signup(this.signupForm.value).subscribe(() => {
        this.signupForm.reset();
        this.activeModal.close(UserAuthComponent);
      });
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleSignupForm() {
    this.openSignupForm = !this.openSignupForm;
  }

}
