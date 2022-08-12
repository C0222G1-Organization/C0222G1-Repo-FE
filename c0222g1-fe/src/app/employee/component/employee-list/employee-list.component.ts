import {Component, OnInit} from '@angular/core';
import {EmployeeService} from '../../service/employee.service';
import {Employee} from '../../model/employee';
import {Position} from '../../model/position';
import {ToastrService} from "ngx-toastr";


@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  page = 0;
  totalElements: any;
  employees: any;
  positions: Position[];
  code = '';
  name = '';
  dobfrom = '';
  dobe = '';
  workf = '';
  workt = '';
  position = '';
  address = '';
  idDelete: number;
  nameDelete: string;

  employeeDelete: Employee = {
    id: 0,
    name: ''
  };

  constructor(private employeeService: EmployeeService,
              private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.getPosition();
    this.search();
  }

  getAll() {
    this.employeeService.getEmployeeList(this.page, this.code, this.name, this.dobfrom,
      this.dobe, this.workf, this.workt, this.position, this.address).subscribe((value: any) => {
      console.log(this.page);
      this.employees = value.content;
      console.log(value);
      this.totalElements = value.totalElements;
      // this.pages = new Array<number>(value.totalPages);
    });
  }

  getPosition() {
    this.employeeService.getPositionList().subscribe(value => {
      this.positions = value;
      console.log(value);
    });
  }

  search() {
    console.log(this.position);
    this.employeeService.getEmployeeList(this.page, this.code, this.name, this.dobfrom,
      this.dobe, this.workf, this.workt, this.position, this.address).subscribe((value: any) => {
      this.employees = value.content;
      this.totalElements = value.totalElements;
    });
  }

  getPage(event: number) {
    this.page = event - 1;
    this.ngOnInit();
  }

  getEmployee(employee: Employee) {
    this.idDelete = employee.id;
    this.nameDelete = employee.name;
  }

  deleteEmployee() {
    this.employeeService.deleteEmployee(this.idDelete).subscribe(value => {

      this.toastr.success('Thành công', 'Xóa nhân viên');
      this.getAll();
    }, error => {
      console.log(error);
    });
  }
}
