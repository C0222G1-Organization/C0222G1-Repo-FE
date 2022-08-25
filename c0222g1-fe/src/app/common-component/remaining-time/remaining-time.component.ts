import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../authentication/service/auth.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-remaining-time',
  templateUrl: './remaining-time.component.html',
  styleUrls: ['./remaining-time.component.css']
})
export class RemainingTimeComponent implements OnInit {

  endTimeMillisecs: any;
  cDateMillisecs: any;
  currentDate: any;
  difference: any;
  remainingTimeSeconds: any;
  remainingTimeMinutes: any;
  remainingTimeHours: any;
  remainingTimeDays: any;
  endTime: Date;
  remainingTimeBackEnd = 0;
  data: Map<string, any> = new Map<string, any>();
  loop: any;
  countRequest = 1;
  remainingTimeRequest = 0;

  constructor(private toartrs: ToastrService, private authService: AuthService) {
  }

  ngOnInit(): void {

    this.endTime = this.convertStringToDate(localStorage.getItem('startTime'));
    this.endTime.setSeconds(this.endTime.getSeconds() + Number(localStorage.getItem('remainingTime')));
    console.log(this.endTime);
    setTimeout(() => {
      this.countDownDate();
    }, 1000);
    this.stopLoop();
  }


  stopLoop() {
    this.authService.checkData.subscribe(value => {
      if (value !== undefined) {
        this.data = value;
        if (this.data.has('logout')) {
          clearInterval(this.loop);
        }
      }
    });
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
      this.remainingTimeSeconds = Math.floor(this.difference / 1000);
      this.remainingTimeMinutes = Math.floor(this.remainingTimeSeconds / 60);
      this.remainingTimeHours = Math.floor(this.remainingTimeMinutes / 60);
      this.remainingTimeDays = Math.floor(this.remainingTimeHours / 24);

      this.remainingTimeHours %= 24;
      this.remainingTimeMinutes %= 60;
      this.remainingTimeSeconds %= 60;

      this.remainingTimeHours = this.remainingTimeHours < 10 ? '0' + this.remainingTimeHours : this.remainingTimeHours;
      this.remainingTimeMinutes = this.remainingTimeMinutes < 10 ? '0' + this.remainingTimeMinutes : this.remainingTimeMinutes;
      this.remainingTimeSeconds = this.remainingTimeSeconds < 10 ? '0' + this.remainingTimeSeconds : this.remainingTimeSeconds;

      if (this.remainingTimeDays > 0) {
        document.getElementById('remaining-time-days').innerText = this.remainingTimeDays + ' ngày ';
      }
      if (document.getElementById('remaining-time-hours') === null) {
        clearInterval(this.loop);
      }
      document.getElementById('remaining-time-hours').innerText = this.remainingTimeHours;
      document.getElementById('remaining-time-mins').innerText = this.remainingTimeMinutes;
      document.getElementById('remaining-time-seconds').innerText = this.remainingTimeSeconds;

      if (this.difference < 1000) {
        clearInterval(this.loop);
        this.authService.sendData('timeout', 'timeout');
      }
      if (this.countRequest >= 5) {
        this.authService.getRemainingTime(Number(localStorage.getItem('customerId'))).subscribe(value => {
          if (value !== undefined) {
            this.remainingTimeBackEnd = value.remaining_time;
            if (this.remainingTimeBackEnd === Number(localStorage.getItem('remainingTime'))) {
              this.remainingTimeRequest = Math.trunc(this.difference / 1000);
              this.authService.setOutOfTime(Number(localStorage.getItem('customerId')), this.remainingTimeRequest).subscribe(value2 => {
                localStorage.setItem('remainingTime', String(this.remainingTimeRequest));
              }, error => {
                this.toartrs.error('Lỗi ' + error.status + ' kết nối server: set out of time2');
              });
            }
            if (this.remainingTimeBackEnd > Number(localStorage.getItem('remainingTime'))) {
              localStorage.setItem('remainingTime', String(this.remainingTimeBackEnd));
            }
          }
        }, error => {
          this.toartrs.error('Lỗi ' + error.status + ' kết nối server: set out of time1');
        });
        this.countRequest = 1;
      } else {
        this.countRequest++;
      }
    }, 1000);
  }

}
