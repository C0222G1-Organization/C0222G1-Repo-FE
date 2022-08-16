import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../authentication/service/auth.service';
import {JwtResponseCustomer} from '../../model/jwt-response-customer';
import {Title} from '@angular/platform-browser';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home-page-customer',
  templateUrl: './home-page-customer.component.html',
  styleUrls: ['./home-page-customer.component.css']
})
export class HomePageCustomerComponent implements OnInit {

  jwtReponseCustomer = {customer: {}} as JwtResponseCustomer;
  currentDate: any;
  cDateMillisecs: any;
  difference: any;
  seconds: any;
  minutes: any;
  hours: any;
  days: any;
  loop: any;
  customerId: number = Number(sessionStorage.getItem('customerId'));

  constructor(private authService: AuthService, private title: Title, private toartrs: ToastrService, private router: Router) {
  }

  ngOnInit(): void {
    this.title.setTitle('Trang chủ khách hàng');
    this.jwtReponseCustomer.customer.name = sessionStorage.getItem('name');
    this.jwtReponseCustomer.startTime = sessionStorage.getItem('startTime');
    this.jwtReponseCustomer.endTime = sessionStorage.getItem('endTime');
    this.jwtReponseCustomer.computerCode = sessionStorage.getItem('computerCode');
    this.convertStringToDate(sessionStorage.getItem('endTime'));
    this.countDownDate();
  }

  convertStringToDate(dateString: string) {
    const [timeComponents, dateComponents] = dateString.split(' ');
    const [day, month, year] = dateComponents.split('-');
    const [hours, minutes, seconds] = timeComponents.split(':');
    const date = new Date(+year, +month - 1, +day, +hours, +minutes, +seconds);
    sessionStorage.setItem('milisecsEndTime', String(date.getTime()));
  }


  countDownDate() {
    this.loop = setInterval(() => {
      this.currentDate = new Date();
      this.cDateMillisecs = this.currentDate.getTime();
      // @ts-ignore
      this.difference = sessionStorage.getItem('milisecsEndTime') - this.cDateMillisecs;

      this.seconds = Math.floor(this.difference / 1000);
      this.minutes = Math.floor(this.seconds / 60);
      this.hours = Math.floor(this.minutes / 60);
      this.days = Math.floor(this.hours / 24);

      this.hours %= 24;
      this.minutes %= 60;
      this.seconds %= 60;

      this.hours = this.hours < 10 ? '0' + this.hours : this.hours;
      this.minutes = this.minutes < 10 ? '0' + this.minutes : this.minutes;
      this.seconds = this.seconds < 10 ? '0' + this.seconds : this.seconds;
      if (this.days > 0) {
        document.getElementById('days').innerText = this.days + ' ngày ';
      }
      document.getElementById('hours').innerText = this.hours;
      document.getElementById('mins').innerText = this.minutes;
      document.getElementById('seconds').innerText = this.seconds;

      if (this.difference < 1000) {
        clearInterval(this.loop);
        // sessionStorage.removeItem('token');
        // sessionStorage.removeItem('roles');
        // sessionStorage.removeItem('username');
        // this.authService.sendData('login', false);
        // this.toartrs.error('Tài khoản hết giờ');
        // this.authService.setOutOfTime(this.customerId, 0).subscribe(value => {
        //   this.router.navigate(['']);
        // }, error => {
        //   this.toartrs.error('Lỗi tài khoản hết giờ');
        //   this.router.navigate(['']);
        // });
      }
    }, 1000);
  }


}
