import {Component, OnInit} from '@angular/core';
import {ComputerService} from '../../service/computer.service';
import {SearchDto} from '../../model/search-dto';
import {ToastrService} from 'ngx-toastr';
import {ComputerType} from '../../model/computer-type';

@Component({
  selector: 'app-computer-list',
  templateUrl: './computer-list.component.html',
  styleUrls: ['./computer-list.component.css']
})
export class ComputerListComponent implements OnInit {
  code = '';
  location = '';
  start = '';
  end = '';
  status = '';
  typeId = '';
  computers: SearchDto[] = [];
  computer: SearchDto;
  page = 0;
  totalItems: any;
  itemsPerPage = 2;
  computerCodeDelete: string;
  idDelete: string;
  computerDeleteList: any[] = [];
  computerTypes: ComputerType[] = [];

  constructor(private computerService: ComputerService,
              private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.findAll();
    this.getAllComputerType();
  }

  /**
   * Created by: PhucNQ
   * Date created: 14/08/2022
   * Function: findAll
   */
  findAll() {
    this.computerService.findAll(this.page,
      this.code,
      this.location,
      this.start,
      this.end,
      this.status,
      this.typeId).subscribe((list: any) => {
        console.log('findAll');
        console.log(list);
        console.log('length ' + this.computers.length);
        this.computers = list.content;
        this.totalItems = list.totalElements;
        console.log('findAll');
    }, error => {
      this.toastr.error('Không tìm thấy');
    });
  }

  /**
   * Created by: PhucNQ
   * Date created: 14/08/2022
   * Function: getAllComputerType
   */
  getAllComputerType() {
    this.computerService.getAll().subscribe(value => {
      this.computerTypes = value;
      console.log(value);
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
   * Function: getPage
   */
  getPage(event: number) {
    this.page = event - 1;
    this.findAll();
  }

  /**
   * Created by: PhucNQ
   * Date created: 14/08/2022
   * Function: isAllCheckBoxChecked
   */
  isAllCheckBoxChecked() {
    if (this.computers.length !== 0) {
      return this.computers.every(p => p.checked);
    }
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
   * Function: showAllItemsChecked()
   */
  showAllItemsChecked() {
    for (let i = 0; i < this.computers.length; i++) {
      if (this.computers[i].checked) {
        this.computerDeleteList.push(this.computers[i].code);
      } else {
        this.computerDeleteList.splice(this.computer[i].code, 1);
      }
    }
  }

  /**
   * Created by: PhucNQ
   * Date created: 14/08/2022
   * Function: deleteAllComputer()
   */
  deleteMultiComputer() {
    const selectedComputer = this.computers.filter(computer => computer.checked).map(p => p.id);
    this.computerDeleteList = this.computers.filter(computer => computer.checked).map(p => p.code);
    if (this.computerDeleteList.length !== 0) {
      for (const computer of selectedComputer) {
        this.idDelete = computer;
        console.log(computer);
        this.computerService.delete(this.idDelete).subscribe(value => {
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
        }, () => {
          this.toastr.success('Xóa thành công');
          this.ngOnInit();
        });
      }
    } else {
      this.toastr.error('Không có máy nào được chọn');
    }
  }
}
