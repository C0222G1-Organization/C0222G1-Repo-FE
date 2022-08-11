import {Component, OnInit} from '@angular/core';
import {Computer} from "../../model/computer";
import {FormControl, FormGroup} from "@angular/forms";
import {ComputerService} from "../../service/computer.service";
import {ToastrService} from "ngx-toastr";
import {ComputerTypeService} from "../../service/computer-type.service";
import {ComputerType} from "../../model/computer-type";

@Component({
  selector: 'app-computer-create',
  templateUrl: './computer-create.component.html',
  styleUrls: ['./computer-create.component.css']
})
export class ComputerCreateComponent implements OnInit {
  // computer: Computer[];
  computerType: ComputerType[]
  formComputer = new FormGroup({
      id: new FormControl(),
      code: new FormControl(),
      status: new FormControl(),
      location: new FormControl(),
      startUsedDate: new FormControl(),
      configuration: new FormControl(),
      manufacturer: new FormControl(),
      deleteStatus: new FormControl(),
      warranty: new FormControl(),
      computerType: new FormGroup({
        id: new FormControl(),
        name: new FormControl()
      })

    }
  )

  constructor(private computerService: ComputerService,
              private toast: ToastrService,
              private computerTypeService: ComputerTypeService) {
  }

  getAllComputerType() {
    this.computerTypeService.getAll().subscribe(value => {
      this.computerType = value;
      console.log(value)
    })
  }

  ngOnInit(): void {
    this.getAllComputerType()
  }

  submitCreate() {
    this.computerService.createComputer(this.formComputer.value).subscribe(value => {
      this.toast.success('Thêm mới thành công!', 'Computer')
      this.formComputer.reset();
      // this
    })
  }
}
