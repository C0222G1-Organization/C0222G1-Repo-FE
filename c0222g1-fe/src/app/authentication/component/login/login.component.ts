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
    if (sessionStorage.getItem('usernameLogin') !== null) {
      this.rememberMeBox = true;
    }
    this.title.setTitle('Đăng nhập');
    this.jwtReponseCustomer.customer.id = 1;
    if (sessionStorage.getItem('roles') !== null) {
      this.redirectByRoles(sessionStorage.getItem('roles'));
    }
    this.loginForm = new FormGroup({
      // tslint:disable-next-line:max-line-length
      username: new FormControl(sessionStorage.getItem('usernameLogin'), [Validators.required, Validators.minLength(6), Validators.maxLength(40)]),
      // tslint:disable-next-line:max-line-length
      password: new FormControl(sessionStorage.getItem('passwordLogin'), [Validators.required, Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$')]),
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
              sessionStorage.setItem('remainingTime', value.customer.remainingTime);
              sessionStorage.setItem('computerCode', value.computerCode);
              sessionStorage.setItem('computerId', value.computerId);
              sessionStorage.setItem('name', value.customer.name);
              sessionStorage.setItem('recordId', value.recordId);
              sessionStorage.setItem('customerId', value.customer.id);
              sessionStorage.setItem('loopTimeCustomer', '0');
              this.authService.sendData('customer', true);
            } else {
              sessionStorage.setItem('name', value.employee.name);
              sessionStorage.setItem('loopTimeCustomer', '1');
            }

            sessionStorage.setItem('username', this.login.username);
            const tokenStr = 'Bearer ' + value.token;
            sessionStorage.setItem('token', tokenStr);
            sessionStorage.setItem('roles', this.roles);
            this.toartrs.success('Đăng nhập thành công');
            this.authService.sendData('login', true);
            setTimeout(() => {
              this.redirectByRoles(this.roles);
            }, 50);

            if (this.rememberMeBox) {
              this.login = this.loginForm.value;
              sessionStorage.setItem('usernameLogin', this.login.username);
              sessionStorage.setItem('passwordLogin', this.login.password);
            }

            this.currentDate = new Date();
            const startTime = this.datepipe.transform(this.currentDate, 'HH:mm:ss dd-MM-yyyy');
            sessionStorage.setItem('startTime', startTime);
          }
        }, error => {
          console.log(error);
          this.toartrs.error(error.error.message);
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
      sessionStorage.setItem('usernameLogin', this.login.username.toLowerCase());
      sessionStorage.setItem('passwordLogin', this.login.password);
      this.toartrs.success('Đã nhớ mật khẩu');
    } else {
      sessionStorage.removeItem('usernameLogin');
      sessionStorage.removeItem('passwordLogin');
      this.toartrs.success('Hủy nhớ mật khẩu');
    }
  }
}
