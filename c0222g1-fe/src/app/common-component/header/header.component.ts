import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../authentication/service/auth.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  username = '';
  login = false;
  data: Map<string, any> = new Map<string, any>();
  roles = 'GUEST';
  customerCard = false;
  employeeCard = false;
  computerCard = false;
  gameCard = false;
  newsCard = false;
  serviceCard = false;
  statisticalCard = false;

  currentDate: any;
  cDateMillisecs: any;
  difference: any;
  secondss: any;
  minutess: any;
  hourss: any;
  dayss: any;
  loop: any;
  countRequest = 1;
  customerId = 0;
  showDate = true;


  constructor(private authService: AuthService, private toartrs: ToastrService, private router: Router) {
  }

  ngOnInit(): void {
    if (sessionStorage.getItem('roles') === 'EMPLOYEE' || sessionStorage.getItem('roles') === 'ADMIN') {
      this.showDate = false;
    }

    if (sessionStorage.getItem('customerId') !== null) {
      this.customerId = Number(sessionStorage.getItem('customerId'));
      this.getRemainingTime(this.customerId);
    }

    this.checkLogin();
    this.checkRoles();

    if (sessionStorage.getItem('milisecsEndTime') !== null) {
      this.countDownDate();
    }

    const items = document.querySelectorAll('ul li');
    items.forEach((item) => {
      item.addEventListener('click', () => {
        document.querySelector('li.active').classList.remove('active');
        item.classList.add('active');
      });
    });
  }

  getRemainingTime(id: number) {
    this.authService.getRemainingTime(id).subscribe(value => {
      if (value !== undefined) {
        // sessionStorage.setItem('milisecsEndTime', String(value.remaining_time * 1000));
      }
    }, error => {
      this.toartrs.error('Lỗi kết nối server: get remaining time');
    });

  }

  countDownDate() {
    this.loop = setInterval(() => {
      this.currentDate = new Date();
      this.cDateMillisecs = this.currentDate.getTime();
      // @ts-ignore
      this.difference = Number(sessionStorage.getItem('milisecsEndTime')) - this.cDateMillisecs;
      this.secondss = Math.floor(this.difference / 1000);
      this.minutess = Math.floor(this.secondss / 60);
      this.hourss = Math.floor(this.minutess / 60);
      this.dayss = Math.floor(this.hourss / 24);

      this.hourss %= 24;
      this.minutess %= 60;
      this.secondss %= 60;

      this.hourss = this.hourss < 10 ? '0' + this.hourss : this.hourss;
      this.minutess = this.minutess < 10 ? '0' + this.minutess : this.minutess;
      this.secondss = this.secondss < 10 ? '0' + this.secondss : this.secondss;

      if (this.dayss > 0) {
        document.getElementById('dayss').innerText = this.dayss + ' ngày ';
      }

      document.getElementById('hourss').innerText = this.hourss;
      document.getElementById('minss').innerText = this.minutess;
      document.getElementById('secondss').innerText = this.secondss;

      if (this.difference < 1000) {
        clearInterval(this.loop);
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('roles');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('milisecsEndTime');
        this.authService.sendData('login', false);
        this.toartrs.error('Tài khoản hết giờ');
        this.authService.setOutOfTime(this.customerId, 0).subscribe(value => {
          this.router.navigate(['']);
        }, error => {
          this.toartrs.error('Lỗi tài khoản hết giờ');
          this.router.navigate(['']);
        });
      }

      // if (this.countRequest >= 5) {
      //   const timeOf = this.difference / 1000;
      //   this.authService.setOutOfTime(Number(sessionStorage.getItem('customerId')), timeOf).subscribe(value => {
      //     this.toartrs.error('đã load lại remaining time');
      //   }, error => {
      //     this.toartrs.error('Lỗi kết nối server: set out of time');
      //     this.toartrs.error(error.status);
      //   });
      //   this.countRequest = 1;
      // } else {
      //   this.countRequest++;
      // }

    }, 1000);
  }

  checkLogin() {
    this.authService.checkData.subscribe(value => {
      if (value !== undefined) {
        this.data = value;
        if (this.data.has('login')) {
          this.login = this.data.get('login');
          this.username = sessionStorage.getItem('name');
          this.roles = sessionStorage.getItem('roles');
          this.checkRoles();
        }
      }
    });
    if (sessionStorage.getItem('token')) {
      this.login = true;
      this.username = sessionStorage.getItem('name');
      this.roles = sessionStorage.getItem('roles');
      this.checkRoles();
    }
  }


  private checkRoles() {
    if (this.roles === 'EMPLOYEE') {
      this.customerCard = true;
      this.employeeCard = false;
      this.computerCard = true;
      this.gameCard = true;
      this.newsCard = true;
      this.serviceCard = true;
      this.statisticalCard = true;
    } else if (this.roles === 'ADMIN') {
      this.customerCard = true;
      this.employeeCard = true;
      this.computerCard = true;
      this.gameCard = true;
      this.newsCard = true;
      this.serviceCard = true;
      this.statisticalCard = true;
    } else {
      this.customerCard = false;
      this.employeeCard = false;
      this.computerCard = false;
      this.gameCard = true;
      this.newsCard = true;
      this.serviceCard = true;
      this.statisticalCard = false;
    }
    console.log(this.roles);
    console.log('customerCard ' + this.customerCard);
    console.log('employeeCard ' + this.employeeCard);
    console.log('computerCard ' + this.computerCard);
    console.log('gameCard ' + this.gameCard);
    console.log('newsCard ' + this.newsCard);
    console.log('serviceCard ' + this.serviceCard);
    console.log('statisticalCard ' + this.statisticalCard);

  }
}
