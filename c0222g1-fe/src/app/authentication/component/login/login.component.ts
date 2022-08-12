import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Ilogin} from '../../model/ilogin';
import {AuthService} from '../../service/auth.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  login: Ilogin = {
    username: '',
    password: ''
  };

  constructor(private authService: AuthService, private toartrs: ToastrService, private router: Router) {
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]),
    });
  }

  submitLogin() {
    this.login = this.loginForm.value;
    this.authService.requestLogin(this.login).subscribe(value => {
        if (value !== undefined) {
          sessionStorage.setItem('username', this.login.username);
          const tokenStr = 'Bearer ' + value.token;
          sessionStorage.setItem('token', tokenStr);
          sessionStorage.setItem('roles', JSON.stringify(value.roles[0].authority));
          if (value.roles[0].authority === 'ADMIN') {
            this.router.navigate(['']);
          } else if (value.roles[0].authority === 'EMPLOYEE') {
            this.router.navigate(['']);
          } else {
            this.router.navigate(['home-page-customer']);  // CUSTOMER
          }
          this.toartrs.success('Đăng nhập thành công', 'THÔNG BÁO');
        }
      }, error => {
        console.log(error);
        this.toartrs.error('Đăng nhập không thành công', 'THÔNG BÁO');
      }
    );
  }

}
