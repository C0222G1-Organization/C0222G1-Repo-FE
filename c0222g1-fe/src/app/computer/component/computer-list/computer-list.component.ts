import {Component, OnInit} from '@angular/core';
import {ComputerService} from '../../service/computer.service';
import {SearchDto} from '../../model/search-dto';
import {ToastrService} from 'ngx-toastr';
import {ComputerType} from '../../model/computer-type';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-computer-list',
  templateUrl: './computer-list.component.html',
  styleUrls: ['./computer-list.component.css']
})

export class ComputerListComponent implements OnInit {
  formSearch: FormGroup = new FormGroup({
    code: new FormControl('', Validators.pattern('^[a-zA-z0-9]+$')),
    location: new FormControl('', Validators.pattern('^[a-zA-z0-9]+$')),
    start: new FormControl('', this.checkStart),
    end: new FormControl('', this.checkEnd),
    typeId: new FormControl(''),
    status: new FormControl(''),
  }, this.checkDate);
  computers: SearchDto[] = [];
  computer: SearchDto;
  page = 0;
  totalItems: any;
  totalPages: any;
  itemsPerPage = 2;
  computerCodeDelete: string;
  idDelete: string;
  checkShow = false;
  map = new Map();
  computerDeleteList: any[] = [];
  computerTypes: ComputerType[] = [];
  checkDelete: any;

  constructor(private computerService: ComputerService,
              private toastr: ToastrService,
              private title: Title) {
    this.title.setTitle('Danh sách máy');
  }

  ngOnInit(): void {
    this.findAll();
    this.getAllComputerType();
  }

  reset() {
    this.formSearch = new FormGroup({
      code: new FormControl('', Validators.pattern('^[a-zA-z0-9]+$')),
      location: new FormControl('', Validators.pattern('^[a-zA-z0-9]+$')),
      start: new FormControl('', this.checkStart),
      end: new FormControl('', this.checkEnd),
      typeId: new FormControl(''),
      status: new FormControl(''),
    }, this.checkDate);
  }

  /**
   * Created by: PhucNQ
   * Date created: 14/08/2022
   * Function: findAll
   */
  findAll() {
    const value = this.formSearch.value;
    this.computerService.findAll(this.page,
      value.code,
      value.location,
      value.start,
      value.end,
      value.status,
      value.typeId).subscribe((list: any) => {
      this.computers = list.content;
      if (this.computers.length === 0) {
        this.toastr.error('Không tìm thấy');
      } else {
        this.computers = list.content;
        this.totalItems = list.totalElements;
        this.totalPages = list.totalPages;
        this.reset();
      }
      this.isAllCheckBoxChecked();
    }, error => {
      this.toastr.error('Không tìm thấy');
    });
  }

  /**
   * Created by: PhucNQ
   * Date created: 14/08/2022
   * Function: search
   */
  search() {
    const value = this.formSearch.value;
    if (this.page > 0) {
      this.page = 0;
    }
    this.computerService.findAll(this.page,
      value.code,
      value.location,
      value.start,
      value.end,
      value.status,
      value.typeId).subscribe((list: any) => {
      this.computers = list.content;
      if (this.computers.length === 0) {
        this.toastr.error('Không tìm thấy');
      } else {
        this.computers = list.content;
        this.totalItems = list.totalElements;
        this.totalPages = list.totalPages;
      }
      this.isAllCheckBoxChecked();
    }, error => {
      this.toastr.error('Không tìm thấy');
    });
  }

  /**
   * Created by: PhucNQ
   * Date created: 14/08/2022
   * Function: getPage
   */
  getPage(page) {
    this.map.forEach(value => {
      value.checked = false;
    });
    if (page < 1 || page > this.totalPages) {
      this.toastr.error('Vui lòng nhập đúng');
    }
    this.page = page;
    this.page = page - 1;
    this.findAll();
  }

  /**
   * Created by: PhucNQ
   * Date created: 14/08/2022
   * Function: getAllComputerType
   */
  getAllComputerType() {
    this.computerService.getAll().subscribe(value => {
      this.computerTypes = value;
    });
  }

  /**
   * Created by: PhucNQ
   * Date created: 14/08/2022
   * Function: getInfo(searchDto: SearchDto)
   */
  getInfo(searchDto: SearchDto) {
    this.computer = searchDto;
    this.computerCodeDelete = searchDto.code;
  }

  /**
   * Created by: PhucNQ
   * Date created: 14/08/2022
   * Function: delete
   */
  delete() {
    // sessionStorage.getItem('roles')
    // if(sessionStorage.getItem('roles') === 'ADMIN'){
    //   this.buttondelete = true;
    // }
    this.computerService.delete(this.computer.id).subscribe(res => {
      if (this.computers.length === 1) {
        if (this.page === 0) {
          this.page = 0;
        } else {
          this.page -= 1;
        }
      }
      this.toastr.success('Xóa máy thành công');
    }, error => {
      this.toastr.error('Xóa máy không thành công');
    }, () => {
      this.findAll();
    });
  }

  /**
   * Created by: PhucNQ
   * Date created: 14/08/2022
   * Function: isAllCheckBoxChecked
   */
  isAllCheckBoxChecked() {
    this.computers.forEach(value => {
      if (value.checked === true) {
        this.map.set(value.id, value);
      } else {
        this.map.delete(value.id);
      }
    });
    if (this.computers.length === 0) {
      return false;
    }
    return this.computers.every(p => p.checked);
  }

  /**
   * Created by: PhucNQ
   * Date created: 14/08/2022
   * Function: checkAllCheckBox(event: any)
   */
  checkAllCheckBox(event: any) {
    this.computers.forEach(x => x.checked = event.target.checked);
  }

  /**
   * Created by: PhucNQ
   * Date created: 14/08/2022
   * Function: deleteAllComputer()
   */
  deleteMultiComputer() {
    // sessionStorage.getItem('roles')
    // if(sessionStorage.getItem('roles') === 'ADMIN'){
    //   this.buttondelete = true;
    // }
    this.computerDeleteList = this.computers.filter(computer => computer.checked).map(p => p.code);
    if (this.computerDeleteList.length !== 0) {
      for (const computer of this.map.values()) {
        this.computerService.delete(computer.id).subscribe(value => {
          if (this.computers.length === 1) {
            if (this.page === 0) {
              this.page = 0;
            } else {
              this.page -= 1;
            }
          }
          if (this.computers.length > 1) {
            if (this.page === 0) {
              this.page = 0;
            } else {
              this.page -= 1;
            }
          }
        }, error => {
          this.checkDelete = error;
        }, () => {
          this.ngOnInit();
        });
        computer.checked = false;
      }
      if (this.checkDelete == null) {
        this.toastr.success('Xóa thành công');
      }
    } else {
      this.toastr.error('Không có máy nào được chọn');
    }
  }

  /**
   * Created by: PhucNQ
   * Date created: 14/08/2022
   * Function: checkDate()
   */
  checkDate(abstractControl: AbstractControl): any {
    const start = new Date(abstractControl.value.start);
    const end = new Date(abstractControl.value.end);
    if (abstractControl.value.starDate === '' || abstractControl.value.endDate === '') {
      return null;
    }
    if (start < end) {
      return null;
    } else {
      return {errorDate: true};
    }
  }

  /**
   * Created by: PhucNQ
   * Date created: 14/08/2022
   * Function: checkStart()
   */
  checkStart(abstractControl: AbstractControl): any {
    const start = new Date(abstractControl.value);
    const now = new Date();
    if (now.getFullYear() - start.getFullYear() > 0 && start.getFullYear() > 1950) {
      return null;
    } else if (now.getFullYear() - start.getFullYear() === 0) {
      if (now.getMonth() > start.getMonth()) {
        return null;
      } else {
        if (now.getMonth() === start.getMonth()) {
          if (now.getDate() >= start.getDate()) {
            return null;
          } else {
            return {invalid: true};
          }
        } else {
          return {invalid: true};
        }
      }
    } else {
      return {invalid: true};
    }
  }

  /**
   * Created by: PhucNQ
   * Date created: 14/08/2022
   * Function: checkEnd()
   */
  checkEnd(abstractControl: AbstractControl): any {
    const end = new Date(abstractControl.value);
    const now = new Date();
    if (now.getFullYear() - end.getFullYear() < 0 && end.getFullYear()) {
      return null;
    } else if (now.getFullYear() - end.getFullYear() === 0) {
      if (now.getMonth() < end.getMonth()) {
        return null;
      } else {
        if (now.getMonth() === end.getMonth()) {
          if (now.getDate() < end.getDate()) {
            return null;
          } else {
            return {invalid: true};
          }
        } else {
          return {invalid: true};
        }
      }
    } else {
      return {invalid: true};
    }
  }
}
