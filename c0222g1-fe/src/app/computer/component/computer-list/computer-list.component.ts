import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ComputerService} from '../../service/computer.service';
import {SearchDto} from '../../model/search-dto';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-computer-list',
  templateUrl: './computer-list.component.html',
  styleUrls: ['./computer-list.component.css']
})
export class ComputerListComponent implements OnInit {
  formSearch: FormGroup = new FormGroup({
    code: new FormControl(''),
    location: new FormControl(''),
    start: new FormControl(''),
    end: new FormControl(''),
    status: new FormControl(''),
    typeId: new FormControl('')
  });
  computers: SearchDto[] = [];
  computer: SearchDto;
  page = 0;
  totalItems: any;
  itemsPerPage = 2;
  numberOfElements: any;
  computerCodeDelete: string;

  constructor(private computerService: ComputerService,
              private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.findAll();
  }

  findAll() {
    const value = this.formSearch.value;
    if (value.start === '') {
      value.start = '1900-10-10';
    }
    if (value.end === '') {
      value.end = '2200-10-10';
    }
    this.computerService.findAll(this.page,
      value.code,
      value.location,
      value.start,
      value.end,
      value.status,
      value.typeId).subscribe((list: any) => {
      console.log('findAll');
      console.log(value);
      console.log(list);
      console.log('length ' + this.computers.length);
      this.computers = list.content;
      this.totalItems = list.totalElements;
      console.log('findAll');
    }, error => {
      console.log(error);
    });
  }

  getInfo(searchDto: SearchDto) {
    this.computer = searchDto;
    this.computerCodeDelete = searchDto.code;
  }

  delete() {
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

  getPage(event: number) {
    this.page = event - 1;
    this.findAll();
  }
}
