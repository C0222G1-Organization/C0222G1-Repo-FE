import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Ilogin} from '../../model/ilogin';
import {AuthService} from '../../service/auth.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {JwtResponseCustomer} from '../../../customer/model/jwt-response-customer';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  roles: string;

  jwtReponseCustomer = {customer: {}} as JwtResponseCustomer;
  login: Ilogin = {
    username: '',
    password: ''
  };

  constructor(private authService: AuthService, private toartrs: ToastrService, private router: Router) {
  }

  ngOnInit(): void {
    this.jwtReponseCustomer.customer.id = 1;
    console.log(this.jwtReponseCustomer);
    // console.log(sessionStorage.getItem('roles'));
    if (sessionStorage.getItem('roles') !== null) {
      this.redirectByRoles(sessionStorage.getItem('roles'));
    }
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]),
    });
  }


  submitLogin() {
    this.login = this.loginForm.value;
    this.authService.requestLogin(this.login).subscribe(value => {
        if (value !== undefined) {
          this.roles = value.roles[0].authority;
          if (this.roles === 'CUSTOMER') {
            sessionStorage.setItem('startTime', value.startTime);
            sessionStorage.setItem('endTime', value.endTime);
            sessionStorage.setItem('computerCode', value.computerCode);
            sessionStorage.setItem('name', value.customer.name);
            sessionStorage.setItem('recordId', value.recordId);
            sessionStorage.setItem('customerId', value.customer.id);
          } else {
            sessionStorage.setItem('name', value.employee.name);
          }

          sessionStorage.setItem('username', this.login.username);
          const tokenStr = 'Bearer ' + value.token;
          sessionStorage.setItem('token', tokenStr);
          sessionStorage.setItem('roles', this.roles);
          this.redirectByRoles(this.roles);
          this.toartrs.success('Đăng nhập thành công');
          this.authService.sendData('login', true);
        }
      }, error => {
        console.log(error);
        this.toartrs.error(error.error.message);
      }
    );
  }

  redirectByRoles(roles: string) {
    if (roles === 'ADMIN') {
      this.router.navigate(['']);
    } else if (roles === 'EMPLOYEE') {
      this.router.navigate(['']);
    } else {
      this.router.navigate(['home-page-customer']);  // CUSTOMER
    }
  }
}
