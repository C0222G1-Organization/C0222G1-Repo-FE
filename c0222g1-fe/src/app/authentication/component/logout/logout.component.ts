import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../service/auth.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {
  data: Map<string, any> = new Map<string, any>();

  constructor(private authService: AuthService, private toartrs: ToastrService, private router: Router) { }

  ngOnInit(): void {
    this.logout();
    this.logoutForOutOfTime();
  }

  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('roles');
    sessionStorage.removeItem('username');
    this.authService.sendData('login', false);
    this.toartrs.success('Đã đăng xuất', );
    setTimeout(() => {
      this.router.navigate(['']);
    }, 50);
  }

  logoutForOutOfTime() {
      this.authService.checkData.subscribe(value => {
      if (value !== undefined) {
        this.data = value;
        if (this.data.has('outOfTime')) {
          // alert('có outOfTime');
          this.logout();
          this.toartrs.error('Tài khoản hết giờ' );
        }
      }
    });
  }

}
