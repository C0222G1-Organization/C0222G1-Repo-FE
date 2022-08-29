import {Component, OnInit} from '@angular/core';
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

  loop: any;
  constructor(private authService: AuthService, private toartrs: ToastrService, private router: Router) {
  }

  ngOnInit(): void {
    this.logout();
    this.logoutForOutOfTime();

  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.authService.sendData('login', false);
    if (localStorage.getItem('roles') === 'CUSTOMER') {
      this.returnComputer();
    }
    localStorage.removeItem('roles');
    localStorage.setItem('loopTimeCustomer', '1');
    localStorage.removeItem('remainingTime');
    localStorage.removeItem('startTime');
    localStorage.removeItem('endTime');
    clearInterval(this.loop);
    this.toartrs.success('Đã đăng xuất');
    this.authService.sendData('logout', 'logout');
    setTimeout(() => {
      this.router.navigate(['']);
    }, 100);
  }

  logoutForOutOfTime() {
    this.authService.checkData.subscribe(value => {
      if (value !== undefined) {
        this.data = value;
        if (this.data.has('outOfTime')) {
          // alert('có outOfTime');
          this.logout();
          this.toartrs.error('Tài khoản hết giờ');
        }
      }
    });
  }

  returnComputer() {
    this.authService.returnComputer(Number(localStorage.getItem('computerId'))).subscribe(value => {
      localStorage.removeItem('computerId');
      localStorage.removeItem('computerCode');
    });
  }

}
