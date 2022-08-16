import {Component, OnInit} from '@angular/core';
import {CustomerService} from '../../service/customer.service';
import {ToastrService} from 'ngx-toastr';
import {AbstractControl, FormControl, FormGroup} from '@angular/forms';
import {CustomerDTO} from '../../model/customerDTO';
import {Title} from "@angular/platform-browser";
@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {
  listCustomer: CustomerDTO[] = [];
  page = 0;
  element: number;
  listCheckBox: number[] = [];
  idCustomerDelete: CustomerDTO = {};
  length = this.listCheckBox.length
  listCustomerCheck: CustomerDTO[] = [];
  statusCheckBox: boolean;
  map = new Map();
  statusCheckBoxAll: boolean;
  id: number
  checked: boolean

  constructor(private customerService: CustomerService, private toast: ToastrService,private title: Title) {
    this.title.setTitle('Danh sách khách hàng')
  }
  color = 'red'


  formSearch = new FormGroup({
    nameCustomer: new FormControl(''),
    starDate: new FormControl(''),
    endDate: new FormControl('',this.checkEndDay),
    activeStatus: new FormControl(''),
    address: new FormControl('')
  },this.checkStartDay);

  ngOnInit(): void {
    this.getAllCustomer();
    console.log(this.length)
  }
  checkEndDay(abstractControl: AbstractControl): any{
    const endDay = new Date(abstractControl.value)
    console.log(abstractControl.value)
    console.log(endDay.toLocaleDateString())
    const now = new Date(new Date().toLocaleDateString())
    if (endDay === now){
      console.log(true)
      return {errorEndDate: true};
    }else{
      return null;
      // console.log(false)
    }
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
        if (data.numberOfElements === 0 && data.totalElements !== 0) {
          this.page = 0;
          this.getAllCustomer();
        }
        this.listCustomer = data.content;
        this.element = data.totalElements;
        if (this.element === 0) {
          this.toast.warning('Không có khách hàng nào trong danh sách ');
        }
      });
  }

  checkStartDay(abstractControl: AbstractControl): any {
    const startDate = new Date(abstractControl.value.starDate)
    const endDay = new Date(abstractControl.value.endDate)
    if (abstractControl.value.starDate === '' || abstractControl.value.endDate === '') {
      return null
    }
    if (startDate < endDay) {
      console.log(true)
      return null
    } else {
      console.log(false)
      return {errorDate: true};

    }
  }

  getPage(page: number) {
    this.page = page - 1;
    for (const key of this.map.values()) {
      key.checked = false;
    }
    this.ngOnInit();
  }

  getIdDeleteInTable(customer: CustomerDTO) {
    console.log(customer);
    this.idCustomerDelete = customer;
  }

  deleteCustomer() {
    this.customerService.deleteCustomerById(this.idCustomerDelete.id).subscribe(value => {
        this.toast.info('Xóa thành công');
        this.ngOnInit();
      }
    );
  }


  DeleteById() {
    for (const key of this.map.values()) {
      this.customerService.deleteCustomerById(key.id).subscribe(value => {
        this.page =0;
        this.ngOnInit();
      })
      key.checked = false;
    }

    this.toast.info('Xóa thành công');


  }

  close() {
    console.log(this.map.size)
  }

  isAllCheckBoxChecked() {
    this.listCustomer.forEach(value => {
      if (value.checked == true && value.deleteStatus == 0) {
        this.map.set(value.id, value)
      } else {
        this.map.delete(value.id)
      }
    })
    console.log(this.map.size)
    return this.listCustomer.every(p => p.checked);
  }


  checkAllCheckBox(event) {
    console.log("event")

    this.listCustomer.forEach(x => x.checked = event.target.checked);

  }



}
