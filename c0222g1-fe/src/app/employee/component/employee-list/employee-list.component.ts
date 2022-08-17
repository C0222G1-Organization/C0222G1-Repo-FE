import {Component, OnInit} from '@angular/core';
import {EmployeeService} from '../../service/employee.service';
import {Employee} from '../../model/employee';
import {Position} from '../../model/position';
import {ToastrService} from 'ngx-toastr';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {Title} from '@angular/platform-browser';

import {Router} from '@angular/router';
// import {isDate} from 'rxjs/internal-compatibility';
import {DatePipe} from '@angular/common';


@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  collection = {count: 60, data: []};
  config = {
    itemsPerPage: 5,
    currentPage: 1,
    totalItems: this.collection.count
  };
  size: number;
  number: number;
  page = 0;
  totalElements: any;
  employees: any;
  positions: Position[];
  formSearch: FormGroup;
  id: number;
  idDelete: number;
  nameDelete: string;
  level: Date = new Date();
  selectedEmployee: any[] = [];
  totalPages: any;
  map = new Map;
  today = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  dobFromSearch = this.datePipe.transform(new Date('1970-01-01'), 'yyyy-MM-dd');
  dobEndSearch = this.datePipe.transform(new Date('2004-08-16'), 'yyyy-MM-dd');
  workFromSearch = this.datePipe.transform(new Date('2010-01-01'), 'yyyy-MM-dd');

  constructor(private employeeService: EmployeeService,
              private title: Title,
              private toastr: ToastrService,
              private route: Router,
              private datePipe: DatePipe) {
    this.title.setTitle('Nhân viên');
    this.formSearch = new FormGroup({
      code: new FormControl('', [Validators.pattern('^[A-Za-z0-9]+$'), Validators.maxLength(20)]),
      // tslint:disable-next-line:max-line-length
      name: new FormControl('', [Validators.pattern('^[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*(?:[ ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*)*$'), Validators.maxLength(20)]),
      dobfrom: new FormControl(''),
      dobend: new FormControl(''),
      workf: new FormControl(''),
      workt: new FormControl('', this.checkDayInFuture),
      position: new FormControl(''),
      // tslint:disable-next-line:max-line-length
      address: new FormControl('', [Validators.pattern('^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ?]+$'), Validators.maxLength(20)]),
    }, [this.checkDate, this.checkDob]);
  }

  ngOnInit(): void {
    this.getPosition();
    this.getAll();
  }

  getAll() {
    const getFormSearch = this.formSearch.value;
    this.employeeService.getEmployeeList(this.page, getFormSearch.code, getFormSearch.name, getFormSearch.dobfrom,
      getFormSearch.dobend, getFormSearch.workf, getFormSearch.workt, getFormSearch.position,
      getFormSearch.address).subscribe((value: any) => {
        console.log(getFormSearch.workf);
        console.log(getFormSearch.workt);
        console.log(getFormSearch.dobfrom);
        console.log(getFormSearch.dobend);
        this.employees = value.content;
        this.totalElements = value.totalElements;
      }, error => {
        this.route.navigateByUrl('/500');
      }
    )
    ;
  }

  getPosition() {
    this.employeeService.getPositionList().subscribe(value => {
      this.positions = value;
      console.log(value);
    });
  }

  search() {
    const getFormSearch = this.formSearch.value;
    if (this.page !== 0) {
      this.page = 0;
    }
    this.employeeService.getEmployeeList(this.page, getFormSearch.code, getFormSearch.name, getFormSearch.dobfrom,
      getFormSearch.dobend, getFormSearch.workf, getFormSearch.workt, getFormSearch.position,
      getFormSearch.address).subscribe((value: any) => {
      this.employees = value.content;
      if (this.employees.isEmpty) {
        this.toastr.warning('Không có dữ liệu phù hợp.');
      }
      this.totalElements = value.totalElements;
    });
  }


  getEmployee(employee: Employee) {
    this.idDelete = employee.id;
    this.nameDelete = employee.name;
  }

  deleteEmployeeList() {
    this.selectedEmployee = this.employees.filter(employee => employee.checked).map(p => p.id);
    for (const employee of this.selectedEmployee) {
      this.id = employee;
      this.employeeService.deleteEmployee(this.id).subscribe(value => {
        this.page = 0;
      }, error => {
      }, () => {
        console.log(this.employees.length);
        this.getAll();
      });
    }
    if (this.selectedEmployee.length > 0) {
      this.toastr.success('Xóa nhân viên thành công');
    }
  }

  deleteEmployee() {
    this.employeeService.deleteEmployee(this.idDelete).subscribe(value => {
      this.page = 0;
      this.toastr.success('Xóa nhân viên thành công');
    }, error => {
      console.log(error);
    }, () => {
      this.getAll();
    });
  }


  exp(employee: Employee): number {


    const exp = this.level.getFullYear() - Number(employee.workf.substr(0, 4));
    return exp + 1;

    const koko = this.level.getFullYear() - Number(employee.workf.substr(0, 4));
    return koko + 1;

  }

  checkDayInFuture(abstractControl: AbstractControl): any {
    console.log(abstractControl.value);
    if (abstractControl.value === '') {
      return null;
    }
    const now = new Date();
    const endDate = new Date(abstractControl.value);
    if (now < endDate) {
      return {futureDate: true};
    }
    return null;
  }

  checkDate(abstractControl: AbstractControl): any {
    const start = new Date(abstractControl.value.workf);
    const end = new Date(abstractControl.value.workt);
    if (abstractControl.value.workf === '' || abstractControl.value.workt === '') {
      return null;
    }
    if (start < end) {
      return {errorDate: true};
    }
    return null;
  }


  checkDob(abstractControl: AbstractControl): any {
    const start = new Date(abstractControl.value.dobfrom);
    const end = new Date(abstractControl.value.dobend);
    if (abstractControl.value.dobfrom === '' || abstractControl.value.dobend === '') {
      return null;
    }
    if (start < end) {
      return {errorDob: true};
    }
    return null;
  }

  getPage(page) {
    if (page < 1 || page > this.totalPages) {
      this.toastr.error('Vui lòng nhập đúng');
    }
    this.page = page;
    page = page - 1;
    const getFormSearch = this.formSearch.value;
    this.employeeService.getEmployeeList(page, getFormSearch.code, getFormSearch.name, getFormSearch.dobfrom,
      getFormSearch.dobend, getFormSearch.workf, getFormSearch.workt, getFormSearch.position,
      getFormSearch.address).subscribe((value: any) => {
      this.employees = value.content;
      this.totalElements = value.totalElements;
      this.totalPages = value.totalPages;
    });
  }

  checkEmployee(id: number) {
    for (const employee of this.employees) {
      console.log(id);
      if (employee.id === id) {
        employee.checked = employee.checked !== true;
        break;
      }
    }
    this.getSelectedEmployees();
  }

  isAllCheckBoxChecked1() {
    this.employees.forEach(value => {
      if (value.checked === true) {
        this.map.set(value.id, value);
      } else {
        this.map.delete(value.id);
      }
    });
    return this.employees.every(e => e.checked);
  }

  checkMultipleCheckBox(event: any) {
    this.employees.forEach(x => x.checked = event.target.checked);
    this.getSelectedEmployees();
  }

  getSelectedEmployees() {
    this.selectedEmployee = this.employees.filter(employee => employee.checked);
  }

  reset() {
    this.formSearch = new FormGroup({
      code: new FormControl('', [Validators.pattern('^[A-Za-z0-9]+$'), Validators.maxLength(20)]),
      // tslint:disable-next-line:max-line-length
      name: new FormControl('', [Validators.pattern('^[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*(?:[ ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*)*$'), Validators.maxLength(20)]),
      dobfrom: new FormControl(''),
      dobend: new FormControl(''),
      workf: new FormControl(''),
      workt: new FormControl('', this.checkDayInFuture),
      position: new FormControl(''),
      // tslint:disable-next-line:max-line-length
      address: new FormControl('', [Validators.pattern('^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ?]+$'), Validators.maxLength(20)]),
    }, [this.checkDate, this.checkDob]);
  }
}
