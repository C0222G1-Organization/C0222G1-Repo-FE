import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../authentication/service/auth.service';
import {JwtResponseCustomer} from '../../model/jwt-response-customer';

@Component({
  selector: 'app-home-page-customer',
  templateUrl: './home-page-customer.component.html',
  styleUrls: ['./home-page-customer.component.css']
})
export class HomePageCustomerComponent implements OnInit {

  jwtReponseCustomer = { customer: {} } as JwtResponseCustomer;
  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.jwtReponseCustomer.customer.name = sessionStorage.getItem('name');
    this.jwtReponseCustomer.startTime = sessionStorage.getItem('startTime');
    this.jwtReponseCustomer.endTime = sessionStorage.getItem('endTime');
    this.jwtReponseCustomer.computerCode = sessionStorage.getItem('computerCode');
  }

}
