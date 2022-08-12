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
      console.log(data);
      this.listCustomer = data.content;
      this.element = data.totalElements;
    });
  }

  getPage(page: number) {
    this.page = page - 1;
    console.log(this.page);
    this.ngOnInit();
  }
}
