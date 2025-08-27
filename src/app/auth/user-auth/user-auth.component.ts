import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../auth-service.service';
@Component({
  selector: 'app-user-auth',
  standalone: false,
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.scss']
})
export class UserAuthComponent implements OnInit {
  openSignupForm: boolean = false;
  showPassword: boolean = false;

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void { }
  userLogin = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  userSignUp = new FormGroup({
    name: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9]{10}$/)
    ]),
    roleName: new FormControl(null, Validators.required),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });


  onloginSubmit() {
    if (this.userLogin.valid) {
      const data = this.userLogin.value;
      this.authService.userLogin(data).subscribe((res) => {
        localStorage.setItem('token', res.token);
        this.userLogin.reset();
      });
    }
  }


  onSignupSubmit() {
    if (this.userSignUp.valid) {
      const data = this.userSignUp.value;
      this.authService.userSignup(data).subscribe((res) => {
        this.userSignUp.reset();
      })
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  openFormSignup() {
    this.openSignupForm = !this.openSignupForm;
  }
}
