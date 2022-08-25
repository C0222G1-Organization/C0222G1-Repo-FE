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
  urlNameHeader = '';

  endTime: Date;
  showTime = true;
  headerEmployee = false;
  remainingTimeComponent = false;
  loop: any;


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
      } else {
        this.showTime = false;
        sessionStorage.setItem('loopTimeCustomer', '1');
      }
    }

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
        } else {
          this.showTime = false;
          sessionStorage.setItem('loopTimeCustomer', '1');
        }
      }
    }, 2000);
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
        if (this.data.has('timeout')) {
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('roles');
          sessionStorage.removeItem('username');
          sessionStorage.removeItem('milisecsEndTime');
          sessionStorage.setItem('loopTimeCustomer', '1');
          this.authService.sendData('login', false);
          this.toartrs.error('Tài khoản hết giờ');
          this.authService.setOutOfTime(Number(sessionStorage.getItem('customerId')), 0).subscribe(value2 => {
            this.authService.returnComputer(Number(sessionStorage.getItem('computerId'))).subscribe();
            this.router.navigate(['']);
          }, error => {
            this.toartrs.error('Lỗi tài khoản hết giờ');
            this.router.navigate(['']);
          });
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
      this.gameCard = false;
      this.newsCard = false;
      this.serviceCard = false;
      this.statisticalCard = false;
    }
    if (sessionStorage.getItem('loopTimeCustomer') !== null) {
      if (sessionStorage.getItem('loopTimeCustomer') === '0') {
        this.urlNameHeader = 'customers/home-page';
        this.remainingTimeComponent = true;
      } else {
        this.urlNameHeader = '';
        this.remainingTimeComponent = false;
      }
    } else {
      this.remainingTimeComponent = false;
    }
  }
}
