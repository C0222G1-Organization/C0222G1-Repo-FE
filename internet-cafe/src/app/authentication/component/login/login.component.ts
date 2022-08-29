import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Ilogin} from '../../model/ilogin';
import {AuthService} from '../../service/auth.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {JwtResponseCustomer} from '../../../customer/model/jwt-response-customer';
import {Title} from '@angular/platform-browser';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  roles: string;
  rememberMeBox = false;
  currentDate: any;

  jwtReponseCustomer = {customer: {}} as JwtResponseCustomer;
  login: Ilogin = {
    username: '',
    password: ''
  };

  constructor(private authService: AuthService, private toartrs: ToastrService,
              private router: Router, private title: Title,
              public datepipe: DatePipe) {
  }

  ngOnInit(): void {
    if (localStorage.getItem('usernameLogin') !== null) {
      this.rememberMeBox = true;
    }
    this.title.setTitle('Đăng nhập');
    this.jwtReponseCustomer.customer.id = 1;
    if (localStorage.getItem('roles') !== null) {
      this.redirectByRoles(localStorage.getItem('roles'));
    }
    this.loginForm = new FormGroup({
      // tslint:disable-next-line:max-line-length
      username: new FormControl(localStorage.getItem('usernameLogin'), [Validators.required, Validators.minLength(6), Validators.maxLength(40)]),
      // tslint:disable-next-line:max-line-length
      password: new FormControl(localStorage.getItem('passwordLogin'), [Validators.required, Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$')]),
    });
  }


  submitLogin() {
    this.login = this.loginForm.value;
    if (this.login.password === '' || this.login.username === '' || this.login.password === null || this.login.username === null) {
      this.toartrs.error('Hãy nhập đủ trường');
    } else {
      this.login.username = this.login.username.toLowerCase();
      this.authService.requestLogin(this.login).subscribe(value => {
          if (value !== undefined) {
            this.roles = value.roles[0].authority;
            if (this.roles === 'CUSTOMER') {
              localStorage.setItem('remainingTime', value.customer.remainingTime);
              localStorage.setItem('computerCode', value.computerCode);
              localStorage.setItem('computerId', value.computerId);
              localStorage.setItem('name', value.customer.name);
              localStorage.setItem('recordId', value.recordId);
              localStorage.setItem('customerId', value.customer.id);
              localStorage.setItem('loopTimeCustomer', '0');
              this.authService.sendData('customer', true);
            } else {
              localStorage.setItem('name', value.employee.name);
              localStorage.setItem('loopTimeCustomer', '1');
            }

            localStorage.setItem('username', this.login.username);
            const tokenStr = 'Bearer ' + value.token;
            localStorage.setItem('token', tokenStr);
            localStorage.setItem('roles', this.roles);
            this.toartrs.success('Đăng nhập thành công');
            this.authService.sendData('login', true);
            setTimeout(() => {
              this.redirectByRoles(this.roles);
            }, 50);

            if (this.rememberMeBox) {
              this.login = this.loginForm.value;
              localStorage.setItem('usernameLogin', this.login.username);
              localStorage.setItem('passwordLogin', this.login.password);
            }

            this.currentDate = new Date();
            const startTime = this.datepipe.transform(this.currentDate, 'HH:mm:ss dd-MM-yyyy');
            localStorage.setItem('startTime', startTime);
          }
        }, error => {
        if (error.status === 500) {
          this.toartrs.error('Có lỗi từ server');
        } else {
          this.toartrs.error(error.error.message);
        }
        }
      );
    }
  }

  redirectByRoles(roles: string) {
    if (roles === 'ADMIN') {
      this.router.navigate(['']);
    } else if (roles === 'EMPLOYEE') {
      this.router.navigate(['']);
    } else {
      this.router.navigate(['/customers/home-page']);  // CUSTOMER
    }
  }

  rememberMe() {
    this.rememberMeBox = !this.rememberMeBox;
    if (this.rememberMeBox) {
      this.login = this.loginForm.value;
      localStorage.setItem('usernameLogin', this.login.username.toLowerCase());
      localStorage.setItem('passwordLogin', this.login.password);
      this.toartrs.success('Đã nhớ mật khẩu');
    } else {
      localStorage.removeItem('usernameLogin');
      localStorage.removeItem('passwordLogin');
      this.toartrs.success('Hủy nhớ mật khẩu');
    }
  }
}
