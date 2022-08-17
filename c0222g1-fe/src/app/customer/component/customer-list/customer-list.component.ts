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
  listCustomerCheck: CustomerDTO[] = [];
  statusCheckBox: boolean;
  map = new Map();
  statusCheckBoxAll: boolean;
  id: number;
  checked: boolean;
  endDayState = false;

  constructor(private customerService: CustomerService, private toast: ToastrService, private title: Title) {
    this.title.setTitle('C02G1|Danh sách khách hàng');
  }

  color = 'red';


  formSearch = new FormGroup({
    nameCustomer: new FormControl('', [Validators.maxLength(30), Validators.pattern('^[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*(?:[ ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*)*$')]),
    endDate: new FormControl('', this.checkEndDay),
    starDate: new FormControl('', this.checkedday),
    activeStatus: new FormControl(''),
    address: new FormControl('', [Validators.maxLength(200), Validators.pattern('^[0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\\\\\\\s? ]+$')])
  }, this.validateStarDayAndEndDay);

  ngOnInit(): void {
    this.getAllCustomer();
    console.log(this.length);
  }

  validateStarDayAndEndDay(abstractControl: AbstractControl): any {
    const startDay = new Date(abstractControl.value.starDate);
    const endDate = new Date(abstractControl.value.endDate);
    if (abstractControl.value.starDate === '' || abstractControl.value.endDate === '') {
      return null;
    }
    if (startDay > endDate) {
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

  getPage(page
            :
            number
  ) {
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
      }
    );
  }


  DeleteById() {
    for (const key of this.map.values()) {
      this.customerService.deleteCustomerById(key.id).subscribe(value => {
        this.page = 0;
        this.ngOnInit();
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

}
