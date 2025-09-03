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
    email: new FormControl('', [Validators.required, Validators.pattern(/^[^@]+@[^@]+\.[^@]+$/)]),
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9]{10}$/)
    ]),
    roleName: new FormControl("USER", Validators.required),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  onLoginSubmit() {
    if (this.loginForm.valid) {
      const encryptedData = {
        ...this.loginForm.value,
        password: this.authService.encryptUsingAES256(this.loginForm.value.password)
      };
      this.authService.login(encryptedData).subscribe({
        next: (res: any) => {
          alert(res.message);
          localStorage.setItem('token', res.data.token);
          this.authService.userDetailsSignal.set(
            this.authService.decodeToken(res.data.token)
          );

          this.loginForm.reset();
          this.activeModal.close(UserAuthComponent);
        },
        error: (err) => console.error(err)
      });
    }
  }

  onSignupSubmit() {
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
        error: (err) => console.error(err)
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
