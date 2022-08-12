import {Component, OnInit} from '@angular/core';
import {Computer} from "../../model/computer";
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {ComputerService} from "../../service/computer.service";
import {ToastrService} from "ngx-toastr";
import {ComputerTypeService} from "../../service/computer-type.service";
import {ComputerType} from "../../model/computer-type";
import {Router} from "@angular/router";

@Component({
  selector: 'app-computer-create',
  templateUrl: './computer-create.component.html',
  styleUrls: ['./computer-create.component.css']
})
export class ComputerCreateComponent implements OnInit {
  computerType: ComputerType[]
  formComputer = new FormGroup({
      id: new FormControl(),
      code: new FormControl('', [Validators.required,
        Validators.pattern('^(CP)[0-9]{4}$')]),
      status: new FormControl('', Validators.required),
      location: new FormControl('', [Validators.required,
        Validators.pattern('^(A)[0-9]{3}$')]),
      startUsedDate: new FormControl('', [Validators.required]),
      configuration: new FormControl('', [Validators.required, Validators.minLength(3),
        Validators.maxLength(20)]),
      manufacturer: new FormControl('', [Validators.required, Validators.minLength(1),
        Validators.maxLength(20)]),
      deleteStatus: new FormControl(''),
      warranty: new FormControl('', Validators.required),
      computerType: new FormGroup({
        id: new FormControl('', Validators.required),
        name: new FormControl('', Validators.required)
      })
    }, this.checkStartDate
  )

  constructor(private computerService: ComputerService,
              private toast: ToastrService,
              private computerTypeService: ComputerTypeService,
              private route: Router) {
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

  checkStartDate(abstractControl: AbstractControl): any {
    const date = new Date(abstractControl.value.startUsedDate);
    const now = new Date();
    console.log(date);
    console.log(now);
    if (date > now) {
      return {dateerror: true};
    } else {
      return null;
    }
  }

  submitCreate() {
    const computer = this.formComputer.value;
    for (const i of this.computerType) {
      if (i.id == computer.computerType.id) {
        computer.computerType.name = i.name;
        break;
      }
    }
    this.computerService.createComputer(this.formComputer.value).subscribe(value => {
      this.toast.success('Thêm mới thành công!', 'Computer')
      this.formComputer.reset();
      // this.route.navigateByUrl('/computer/list')
    })
  }
}
