import {Component, OnInit} from '@angular/core';
import {CustomerService} from '../../service/customer.service';
import {ToastrService} from 'ngx-toastr';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomerDTO} from '../../model/customerDTO';
import {Title} from '@angular/platform-browser';

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
  length = this.listCheckBox.length;
  map = new Map();
  id: number;
  checked: boolean;
  size: number;
  totalPage;


  constructor(private customerService: CustomerService, private toast: ToastrService, private title: Title) {
    this.title.setTitle('C02G1|Danh sách khách hàng');
  }

  color = 'red';


  formSearch = new FormGroup({
    nameCustomer: new FormControl('', [Validators.maxLength(30), Validators.pattern('^[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*(?:[ ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*)*$')]),
    endDate: new FormControl('', this.checkEndDay),
    starDate: new FormControl('', this.checkedday),
    activeStatus: new FormControl(''),
    address: new FormControl('', [Validators.maxLength(100), Validators.pattern('^[0-9a-zA-Z, ]*$')])
  }, this.validateStarDayAndEndDay);

  ngOnInit(): void {
    console.log('page' + this.page);
    this.getAllCustomer();
    console.log(this.length);
  }

  validateStarDayAndEndDay(abstractControl: AbstractControl): any {
    const startDay = new Date(abstractControl.value.starDate);
    const endDate = new Date(abstractControl.value.endDate);
    if (abstractControl.value.starDate === '' || abstractControl.value.endDate === '') {
      return null;
    }
    if (startDay >= endDate) {
      return {errorStartDateMoreEndDate: true};
    }
  }

  checkEndDay(abstractControl: AbstractControl): any {
    console.log(abstractControl.value);
    if (abstractControl.value === '') {
      return null;
    }
    const now = new Date();
    const endDate = new Date(abstractControl.value);
    if (now < endDate) {
      return {errorEndDate: true};
    }
    return null;
  }

  getAllCustomer() {
    const getValueForm = this.formSearch.value;
    this.customerService.getAllCustomer(this.page, getValueForm.address,
      getValueForm.nameCustomer,
      getValueForm.starDate,
      getValueForm.endDate,
      getValueForm.activeStatus)
      .subscribe((data: any) => {
        this.size = data.size * (this.page);
        this.totalPage = data.getTotalPages;
        console.log(data);

        this.listCustomer = data.content;
        this.element = data.totalElements;
        if (this.element === 0) {
          this.toast.warning('Không có khách hàng nào trong danh sách ');
        }
        console.log(this.listCustomer.length);
        if (this.listCustomer.length === 0 && this.element !== 0) {
          this.page = this.page - 1;
          this.ngOnInit();
        }
      });
  }

  checkedday(abstractControl: AbstractControl): any {
    console.log(abstractControl.value);
    const startDate = new Date(abstractControl.value);
    const now = new Date();
    if (abstractControl.value === '') {
      return null;
    }
    console.log(now.getFullYear());
    console.log(startDate.getFullYear());
    if ((startDate.getFullYear() <= 1975)) {
      return {errorDate1975: true};
    }
    if ((now.getFullYear() - startDate.getFullYear()) < 16) {
      return {errorDateAge16: true};
    }
    return null;
  }

  getPage(page: number) {
    this.page = page - 1;
    for (const key of this.map.values()) {
      key.checked = false;
    }
    this.ngOnInit();
  }

  getIdDeleteInTable(customer
                       :
                       CustomerDTO
  ) {
    console.log(customer);
    this.idCustomerDelete = customer;
  }

  deleteCustomer() {
    this.customerService.deleteCustomerById(this.idCustomerDelete.id).subscribe(value => {
      this.toast.info('Xóa thành công');
      this.ngOnInit();
    });
  }


  DeleteById() {
    let i = 0;
    for (const key of this.map.values()) {
      this.customerService.deleteCustomerById(key.id).subscribe(value => {
        if (i === this.map.size) {
          this.ngOnInit();
          i++;
        }
      });
      key.checked = false;
    }
    this.toast.info('Xóa thành công');
  }

  close() {
    console.log(this.map.size);
  }

  isAllCheckBoxChecked() {
    this.listCustomer.forEach(value => {
      if (value.checked === true && value.deleteStatus === 0) {
        this.map.set(value.id, value);
      } else {
        this.map.delete(value.id);
      }
    });
    console.log(this.map.size);
    if (this.listCustomer.length === 0) {
      return false;
    }
    return this.listCustomer.every(p => p.checked);
  }


  checkAllCheckBox(event) {

    return this.listCustomer.forEach(x => x.checked = event.target.checked);

  }


  reload() {
    this.formSearch = new FormGroup({
      nameCustomer: new FormControl('', [Validators.maxLength(30), Validators.pattern('^[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*(?:[ ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*)*$')]),
      endDate: new FormControl('', this.checkEndDay),
      starDate: new FormControl('', this.checkedday),
      activeStatus: new FormControl(''),
      address: new FormControl('', [Validators.maxLength(200), Validators.pattern('^[0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\\\\\\\s? ]+$')])
    }, this.validateStarDayAndEndDay);
  }

  getValueAddress() {
    console.log(this.formSearch.value.address);
    const char = ',';
    let count = 0;
    for (let i = 0; i < this.formSearch.value.address.length; i++) {
      if (char === this.formSearch.value.address[i]) {
        count++;
      }
    }
    console.log('count' + count);
    if (count === 0) {
      this.getAllCustomer();
    }
  }

  getIdCheck(temp: CustomerDTO, checked: any) {
    if (checked === true && temp.deleteStatus === 0) {
      this.map.set(temp.id, temp);
    } else {
      this.map.delete(temp.id);
        }
  }
}
