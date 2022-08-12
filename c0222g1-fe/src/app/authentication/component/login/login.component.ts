import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Ilogin} from '../../model/ilogin';
import {LoginService} from '../../service/login.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  valueServerReponse: any;
  login: Ilogin = {
    username: '',
    password: ''
  };
  constructor(private loginService: LoginService, private toartrs: ToastrService) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]),
    });
  }

  submitLogin() {
    if (this.loginForm.controls.username.hasError('required')) {
      this.toartrs.error('username rỗng', 'THÔNG BÁO');
    }
    this.login = this.loginForm.value;
    this.loginService.requestLogin(this.login).subscribe(value => {
      if (value !== undefined) {
        // @ts-ignore
        this.toartrs.success(value.message, 'THÔNG BÁO');
      }
    }, error => {
      console.log(error);
      this.toartrs.error(error.error.message, 'THÔNG BÁO');
      }
    );
  }
}
