import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { URLConstant } from '../../apiUrls/url';
import { ApiService } from '../../services/api.service';
@Component({
  selector: 'app-user-auth',
  standalone: false,
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.scss']
})
export class UserAuthComponent implements OnInit {
  openSignuForm: boolean = false;
  showPassword: boolean = false;

  constructor(private service: ApiService) {
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
      this.service.post(URLConstant.USER.LOGIN, data).subscribe((res) => {
        console.log(res)
        localStorage.setItem('token', res.token);

        this.userLogin.reset();
      });
    }
  }


  onSignupSubmit() {
    if (this.userSignUp.valid) {
      console.log(this.userSignUp.value)
      const data = this.userSignUp.value;
      this.service.post(URLConstant.USER.REGISTER, data).subscribe((res) => {
        console.log("Signup Data:", res);

        this.userSignUp.reset();
      })
    }
  }



  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  openFormSignup() {
    this.openSignuForm = !this.openSignuForm;
  }
}
