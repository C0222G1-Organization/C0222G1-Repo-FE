import {Component, OnInit} from '@angular/core';
import {CustomerService} from '../../service/customer.service';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {
  listCustomer: any;
  page = 0;
  element: number;

  constructor(private customerService: CustomerService) {
  }

  ngOnInit(): void {
     this.customerService.getAllCustomer(this.page).subscribe((data: any) => {
      this.listCustomer = data.content;
      console.log(this.listCustomer);
      this.element = data.totalItems;
    });
  }

  getPage($event: any) {

  }
}
