import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ComputerService} from '../../service/computer.service';
import {SearchDto} from '../../model/search-dto';

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
  page = 1;
  totalItems: any;
  itemsPerPage = 2;
  computerIdDelete: string;

  constructor(private computerService: ComputerService) {
  }

  ngOnInit(): void {
    this.findAll();
  }

  findAll() {
    const value = this.formSearch.value;
    if (value.start == '') {
      value.start = '1900-10-10';
    }
    if (value.end == '') {
      value.end = '2200-10-10';
    }
    this.computerService.findAll(this.page - 1,
      value.code,
      value.location,
      value.start,
      value.end,
      value.status,
      value.typeId).subscribe((list: any) => {
      console.log(value);
      console.log(list);
      this.computers = list.content;
      this.totalItems = list.totalElements;
      this.page = 1;
    }, error => {
      console.log(error);
    });
  }

  getInfo(searchDto: SearchDto) {
    this.computer = searchDto;
    this.computerIdDelete = searchDto.id;
  }

}
