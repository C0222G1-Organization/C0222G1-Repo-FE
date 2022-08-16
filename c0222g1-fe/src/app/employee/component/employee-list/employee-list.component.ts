import {Component, OnInit} from '@angular/core';
import {EmployeeService} from '../../service/employee.service';
import {Employee} from '../../model/employee';
import {Position} from '../../model/position';
import {ToastrService} from 'ngx-toastr';


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
  selectEmployee: Array<any>;
  level: Date = new Date();
  countLevel: number;

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
      console.log(this.employees[0].workf.substr(0, 4));
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

  isAllCheckBoxChecked() {
    return this.employees.every(p => p.checked);
  }

  checkAllCheckBox(event) {
    this.employees.forEach(x => x.checked = event.target.checked);
  }

  deleteAll() {
    const selectEmployee = this.employees.filter(employee => employee.checked).map(p => p.id);
    for (const employee of selectEmployee) {
      this.idDelete = employee;
      this.employeeService.deleteEmployee(this.idDelete).subscribe(value => {
        if (this.employees.length === 1) {
          if (this.page === 0) {
            this.page = 0;
          } else {
            this.page -= 1;
          }
        }
      }, error => {
      }, () => {
        this.ngOnInit();
      });
    }
  }

  exp(employee: Employee): number {
    const koko = this.level.getFullYear() - Number(employee.workf.substr(0, 4));
    return koko + 1;
  }

  enable() {
  }
}
