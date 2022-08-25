import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../authentication/service/auth.service';
import {Title} from '@angular/platform-browser';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-home-page-customer',
  templateUrl: './home-page-customer.component.html',
  styleUrls: ['./home-page-customer.component.css']
})
export class HomePageCustomerComponent implements OnInit {

  // jwtReponseCustomer = {customer: {}} as JwtResponseCustomer;
  currentDate: Date;
  cDateMillisecs: any;
  endTimeMillisecs: any;
  difference: any;
  seconds: any;
  minutes: any;
  hours: any;
  days: any;
  loop: NodeJS.Timeout;
  endTime: Date;
  customerId: number = Number(localStorage.getItem('customerId'));

  constructor(private authService: AuthService, private title: Title,
              private toartrs: ToastrService, private router: Router,
              public datepipe: DatePipe) {
  }

  ngOnInit(): void {
    this.title.setTitle('Trang chủ khách hàng');
    document.getElementById('fullName').innerText = localStorage.getItem('name');
    document.getElementById('startTime').innerText = localStorage.getItem('startTime');
    this.endTime = this.convertStringToDate(localStorage.getItem('startTime'));
    this.endTime.setSeconds(this.endTime.getSeconds() + Number(localStorage.getItem('remainingTime')));
    const endTime = this.datepipe.transform(this.endTime, 'HH:mm:ss dd-MM-yyyy');
    // @ts-ignore
    localStorage.setItem('endTime', endTime);
    console.log(this.endTime);
    document.getElementById('endTime').innerText = endTime;
    document.getElementById('computerCode').innerText = localStorage.getItem('computerCode');
    this.countDownDate();
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
      // console.log(this.difference);
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
      if (document.getElementById('hours') === null) {
        clearInterval(this.loop);
      }
      document.getElementById('hours').innerText = this.hours;
      document.getElementById('mins').innerText = this.minutes;
      document.getElementById('seconds').innerText = this.seconds;

      if (this.difference < 1000) {
        clearInterval(this.loop);
      }
    }, 1000);
  }


}
