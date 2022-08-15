import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../authentication/service/auth.service';

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
  gameCard = true;
  newsCard = true;
  serviceCard = true;
  statisticalCard = false;

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.checkLogin();
    this.checkRoles();
    const items = document.querySelectorAll('ul li');
    items.forEach((item) => {
      item.addEventListener('click', () => {
        document.querySelector('li.active').classList.remove('active');
        item.classList.add('active');
      });
    });
  }

  checkLogin() {
    this.authService.checkData.subscribe(value => {
      if (value !== undefined) {
        this.data = value;
        if (this.data.has('login')) {
          this.login = this.data.get('login');
          this.username = sessionStorage.getItem('username');
          this.roles = sessionStorage.getItem('roles');
          this.checkRoles();
        }
      }
    });
    if (sessionStorage.getItem('token')) {
      this.login = true;
      this.username = sessionStorage.getItem('username');
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

  }
}
