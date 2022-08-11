import { Component, OnInit } from '@angular/core';
import {Computer} from '../../model/computer';
import {FormControl, FormGroup} from '@angular/forms';
import {ComputerService} from '../../service/computer.service';

@Component({
  selector: 'app-computer-list',
  templateUrl: './computer-list.component.html',
  styleUrls: ['./computer-list.component.css']
})
export class ComputerListComponent implements OnInit {
  formSearch: FormGroup = new FormGroup({
    code: new FormControl(''),
    location: new FormControl(''),
    start: new FormControl('1900-10-10'),
    end: new FormControl('2200-10-10'),
    status: new FormControl(''),
    typeId: new FormControl('')
  });
  computers: Computer[] = [];
  computer: Computer;
  page = 1;
  totalItems: any;
  itemsPerPage = 2;
  computerIdDelete: number;

  constructor(private computerService: ComputerService) { }

  ngOnInit(): void {
    this.findAll();
  }

  findAll() {
    this.computerService.findAll(this.page - 1, this.formSearch.value).subscribe((list: any) => {
      this.computers = list.content;
      this.totalItems = list.totalElements;
      this.page = 1;
    });
  }

  getInfo(computer: Computer) {
    this.computer = computer;
    this.computerIdDelete = computer.id;
  }


}
