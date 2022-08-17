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

  endTimeMillisecs: any;
  cDateMillisecs: any;
  currentDate: any;
  difference: any;
  secondss: any;
  minutess: any;
  hourss: any;
  dayss: any;
  loop: any;
  countRequest = 1;
  endTime: Date;
  showTime = true;
  headerEmployee = false;


  constructor(private authService: AuthService, private toartrs: ToastrService, private router: Router) {
  }

  ngOnInit(): void {
    sessionStorage.getItem('roles') === 'CUSTOMER' ? this.headerEmployee = false : this.headerEmployee = true;
    this.authService.checkData.subscribe(value => {
      if (value !== undefined) {
        this.data = value;
        if (this.data.has('customer')) {
          this.showTime = true;
        } else {
          this.showTime = false;
        }
      }
    });
    this.checkLogin();
    this.checkRoles();
    if (sessionStorage.getItem('loopTimeCustomer') !== null) {
      if (sessionStorage.getItem('loopTimeCustomer') === '0') {
        this.showTime = true;
        this.countDownDate();
      } else {
        this.showTime = false;
        sessionStorage.setItem('loopTimeCustomer', '1');
      }
    }

    this.endTime = this.convertStringToDate(sessionStorage.getItem('startTime'));
    this.endTime.setSeconds(this.endTime.getSeconds() + Number(sessionStorage.getItem('remainingTime')));

    const items = document.querySelectorAll('ul li');
    items.forEach((item) => {
      item.addEventListener('click', () => {
        document.querySelector('li.active').classList.remove('active');
        item.classList.add('active');
      });
    });

    setTimeout(() => {
      if (sessionStorage.getItem('loopTimeCustomer') !== null) {
        if (sessionStorage.getItem('loopTimeCustomer') === '0') {
          this.showTime = true;
          this.countDownDate();
        } else {
          this.showTime = false;
          sessionStorage.setItem('loopTimeCustomer', '1');
        }
      }
    }, 2000);
  }

  convertStringToDate(dateString: string): Date {
    const [timeComponents, dateComponents] = dateString.split(' ');
    const [day, month, year] = dateComponents.split('-');
    const [hours, minutes, seconds] = timeComponents.split(':');
    const date = new Date(+year, +month - 1, +day, +hours, +minutes, +seconds);
    return date;
  }

  countDownDate() {
    this.loop = setInterval(() => {
      this.currentDate = new Date();
      this.cDateMillisecs = this.currentDate.getTime();
      this.endTimeMillisecs = this.endTime.getTime();
      // console.log(this.cDateMillisecs);
      // @ts-ignore
      this.difference = this.endTimeMillisecs - this.cDateMillisecs;
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
        this.authService.setOutOfTime(Number(sessionStorage.getItem('customerId')), 0).subscribe(value => {
          this.authService.returnComputer(Number(sessionStorage.getItem('computerId'))).subscribe();
          this.router.navigate(['']);
        }, error => {
          this.toartrs.error('Lỗi tài khoản hết giờ');
          this.router.navigate(['']);
        });
      }

      if (this.countRequest >= 10) {
        console.log(this.difference / 1000);
        console.log(sessionStorage.getItem('remainingTime'));
        sessionStorage.setItem('remainingTime', String(Math.trunc(this.difference / 1000)));

        this.authService.setOutOfTime(Number(sessionStorage.getItem('customerId')), Math.trunc(this.difference / 1000)).subscribe(value => {
          // this.toartrs.success('đã update remaining time với server');
        }, error => {
          this.toartrs.error('Lỗi kết nối server: set out of time');
        });
        this.countRequest = 1;
      } else {
        this.countRequest++;
      }

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
    this.authService.checkData.subscribe(value => {
      if (value !== undefined) {
        this.data = value;
        if (this.data.has('logout')) {
          this.customerCard = false;
          this.employeeCard = false;
          this.computerCard = false;
          this.gameCard = true;
          this.newsCard = true;
          this.serviceCard = true;
          this.statisticalCard = false;
        }
      }
    });
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
