import {Component, OnInit} from '@angular/core';
import {EmployeeService} from '../../service/employee.service';
import {Employee} from '../../model/employee';
import {Position} from '../../model/position';
import {ToastrService} from 'ngx-toastr';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {Title} from "@angular/platform-browser";

import {Router} from '@angular/router';
import {isDate} from "rxjs/internal-compatibility";
import { DatePipe } from '@angular/common';


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
  page = 0;
  totalElements: any;
  employees: any;
  positions: Position[];
  formSearch: FormGroup;

  idDelete: number;
  nameDelete: string;
  level: Date = new Date();
  selectedEmployee: any[] = [];
  totalPages: any;
  map = new Map;
  today = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  constructor(private employeeService: EmployeeService,
              private title: Title,
              private toastr: ToastrService,
              private route: Router,
              private datePipe: DatePipe) {
    this.title.setTitle('Nhân viên');
    this.formSearch = new FormGroup({
      code: new FormControl('', [Validators.pattern('^[A-Za-z0-9]+$'), Validators.maxLength(20)]),
      name: new FormControl('', [Validators.pattern('^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ?]+$'), Validators.maxLength(20)]),
      dobfrom: new FormControl('', [this.check18, this.check100]),
      dobend: new FormControl('', this.check18, this.check100),
      workf: new FormControl('', this.dateInFuture),
      workt: new FormControl(this.today, this.dateInFuture),
      position: new FormControl(''),
      address: new FormControl('', [Validators.pattern('^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ?]+$'),Validators.maxLength(20)]),
    }, [this.invalidDate, this.dobInvalidDate]);
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
        console.log(getFormSearch.workt);
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

  //
  // getPage(event: number) {
  //   this.page = event - 1;
  //   this.ngOnInit();
  // }

  getEmployee(employee: Employee) {
    this.idDelete = employee.id;
    this.nameDelete = employee.name;
  }

  deleteEmployee() {
    this.employeeService.deleteEmployee(this.idDelete).subscribe((value: any) => {
      if (this.employees.length === 1) {
        if (this.page === 0) {
          this.page = 0;
        } else {
          this.page -= 1;
        }
      }
      this.toastr.success('Xóa nhân viên thành công');
    }, error => {
      console.log(error);
    }, () => {
      this.ngOnInit();
    });
  }


  exp(employee: Employee): number {


    const exp = this.level.getFullYear() - Number(employee.workf.substr(0, 4));
    return exp + 1;

    const koko = this.level.getFullYear() - Number(employee.workf.substr(0, 4));
    return koko + 1;

  }

  dateInFuture(abstractControl: AbstractControl) {
    const v = abstractControl.value;
    const end = new Date(v);
    if (end > new Date()) {
      return {futureDate: true};
    }if (!isDate(end)) {
      return {dateNotExist: true};
    }
    else {
      return null;
    }
  }

  invalidDate(abstractControl: AbstractControl) {
    const v = abstractControl.value;
    const start = new Date(v.workf);
    const end = new Date(v.workt);
    end.setDate(end.getDate() - 1);
    if (start > end) {
      return {dateNotValid: true};
    } else {
      return null;
    }
  }

  dobInvalidDate(abstractControl: AbstractControl) {
    const v = abstractControl.value;
    const start = new Date(v.dobfrom);
    const end = new Date(v.dobend);
    end.setDate(end.getDate() - 1);
    if (start > end) {
      return {dobNotValid: true};
    } else {
      return null;
    }
  }

  private check18(abstractControl: AbstractControl): any {
    const today = new Date();
    const birthDate = new Date(abstractControl.value);
    let age = today.getFullYear() - birthDate.getFullYear();
    const old = today.getMonth() - birthDate.getMonth();
    if (old < 0 || (old === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return (age >= 18) ? null : {not18: true};
  }

  private check100(abstractControl: AbstractControl): any {
    const today = new Date();
    const birthDate = new Date(abstractControl.value);
    let age = today.getFullYear() - birthDate.getFullYear();
    const old = today.getMonth() - birthDate.getMonth();
    if (old < 0 || (old === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return (age <= 100) ? null : {not100: true};
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
      console.log(id)
      if (employee.id == id){
        employee.checked = employee.checked != true;
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

  deleteMultipleEmployee() {
    for (const selectEmployee of this.selectedEmployee) {
      this.employeeService.deleteEmployee(selectEmployee.id).subscribe(res => {
        this.page = 1;
        this.getAll();
        console.log('Xóa thành công');
      }, error => {
        console.log('Xóa thất bại');
      });
    }
    this.toastr.success("Xóa thành công");
  }
}
