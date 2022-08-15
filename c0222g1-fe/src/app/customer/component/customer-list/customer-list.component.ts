import {Component, OnInit} from '@angular/core';
import {CustomerService} from '../../service/customer.service';
import {ToastrService} from 'ngx-toastr';
import {AbstractControl, FormControl, FormGroup} from '@angular/forms';
import {CustomerDTO} from '../../model/customerDTO';
import {keyframes} from "@angular/animations";

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

  constructor(private customerService: CustomerService, private toast: ToastrService) {
  }
  color = 'red'


  formSearch = new FormGroup({
    nameCustomer: new FormControl(''),
    starDate: new FormControl(''),
    endDate: new FormControl('',),
    activeStatus: new FormControl(''),
    address: new FormControl('')
  }, this.checkStartDay);

  ngOnInit(): void {
    this.getAllCustomer();
    console.log(this.length)
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
          this.toast.info('Không có khách hàng nào trong danh sách ');
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
    this.ngOnInit();
  }

  getValue() {
    console.log(this.formSearch.value);

  }

  // getIdCheck(tem: CustomerDTO, checked: any) {
  //
  //   console.log("chahahahahahahha")
  //   if (checked === true) {
  //     this.map.set(tem.id, tem);
  //     console.log("12312313 true     " + this.map.size)
  //
  //   } else {
  //     this.map.delete(tem.id)
  //     console.log("12312313 fales     " + this.map.size)
  //   }
  //   console.log(this.listCustomer.length + "lenght")
  //   console.log(this.map.size + "size map")
  //
  // }


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

        this.ngOnInit();
      })
      key.checked = false;
    }
    this.toast.info('Xóa thành công');


  }

  close() {
    console.log(this.map.size)
  }

  // checkAll(listCustomer: CustomerDTO[], checked: boolean) {
  //   for (let i = 0; i < this.listCustomer.length; i++) {
  //     this.getIdCheck(this.listCustomer[i], checked)
  //   }
  //   this.statusCheckBox = checked
  //
  // }


  // getCustomerCheck(){
  //   this.listCustomer.forEach(value => {
  //     if (value.checked == true){
  //       this.map.set(value.id,value)
  //     }else {
  //       this.map.delete(value.id)
  //     }
  //   })
  //   console.log(this.map)
  // }
  ////trường
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


  buttonDelete() {

  }


}
