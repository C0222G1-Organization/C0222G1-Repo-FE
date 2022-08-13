import {Component, OnInit} from '@angular/core';
import {CustomerService} from '../../service/customer.service';
import {ToastrService} from 'ngx-toastr';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {
  listCustomer: any;
  page = 0;
  element: number;

  constructor(private customerService: CustomerService, private toast: ToastrService) {
  }

  formSearch = new FormGroup({
    nameCustomer: new FormControl(''),
    starDate: new FormControl(''),
    endDate: new FormControl(''),
    activeStatus: new FormControl(''),
    address: new FormControl('')
  });

  ngOnInit(): void {
    this.getAllCustomer();
  }

  getAllCustomer() {
    const getValueForm = this.formSearch.value;
    console.log(getValueForm.name);
    console.log(getValueForm.address);
    console.log(getValueForm.activeStatus);
    this.customerService.getAllCustomer(this.page, getValueForm.address,
                                        getValueForm.nameCustomer,
                                        getValueForm.starDate,
                                        getValueForm.endDate,
                                         getValueForm.activeStatus)
      .subscribe((data: any) => {
        console.log(data);
        if (data.numberOfElements === 0 && data.totalElements !== 0) {
          this.page = 0;
          this.getAllCustomer();
        }
        this.listCustomer = data.content;
        this.element = data.totalElements;
        console.log(this.element);
        if (this.element === 0) {
          this.toast.info('Không có khách hàng nào trong danh sách ');
        }
      });
  }

  getPage(page: number) {
    this.page = page - 1;
    console.log(this.page);
    this.ngOnInit();
  }

  getValue() {
    console.log(this.formSearch.value);

  }
}
