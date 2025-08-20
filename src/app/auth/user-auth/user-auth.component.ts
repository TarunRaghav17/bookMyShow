import { Component, OnInit } from '@angular/core';
import { FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-auth',
  standalone: false,
  templateUrl: './user-auth.component.html',
  styleUrl: './user-auth.component.scss'
})
export class UserAuthComponent implements OnInit {
  openSignuForm: boolean = false

  ngOnInit(): void {

  }
  userLogin = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  })
  userSignUp = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required])
  })





  onloginSubmit() {
    console.log(this.userLogin.value)
    this.userLogin.reset()
  }
  onSignupSubmit() {
    console.log(this.userSignUp.value)
    this.userSignUp.reset()
  }








  openFormSignup() {
    this.openSignuForm = !this.openSignuForm
  }
}
