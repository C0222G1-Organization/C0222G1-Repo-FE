import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {ComputerService} from "../../service/computer.service";
import {ComputerTypeService} from "../../service/computer-type.service";
import {Computer} from "../../model/computer";
import {ComputerType} from "../../model/computer-type";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-computer-edit',
  templateUrl: './computer-edit.component.html',
  styleUrls: ['./computer-edit.component.css']
})
export class ComputerEditComponent implements OnInit {
  formEditComputer = new FormGroup({
      id: new FormControl(),
      code: new FormControl('', [Validators.required,
        Validators.pattern('^(CP)[0-9]{4}$')]),
      status: new FormControl('', Validators.required),
      location: new FormControl('', [Validators.required,
        Validators.pattern('^(A)[0-9]{3}$')]),
      startUsedDate: new FormControl('', [Validators.required]),
      configuration: new FormControl('', [Validators.required]),
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
  id: number;
  computerType: ComputerType[]

  constructor(private computerService: ComputerService,
              private computerTypeService: ComputerTypeService,
              private activatedRoute: ActivatedRoute,
              private toast: ToastrService,
              private route: Router) {
  }

  ngOnInit(): void {
    this.id = Number(this.activatedRoute.snapshot.params.id);
    this.getAll()
    this.findById(this.id)
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

  getAll() {
    this.computerTypeService.getAll().subscribe(value => {
      this.computerType = value;
      console.log(value);
    })
  }

  findById(id) {
    this.computerService.findById(id).subscribe(value => {
      this.formEditComputer.patchValue(value)
      console.log(value);
    })
  }

  cancel() {
    this.toast.error("Sửa thất bại", 'Computer')
    this.route.navigateByUrl("/computer")
  }

  submit() {
    this.computerService.editComputer(this.id, this.formEditComputer.value).subscribe(value => {
        this.toast.success('Sửa thành công', 'Computer')
        this.route.navigateByUrl("/computer")
      },
      error => {
        this.toast.error('Sửa thất bại', 'Computer')
      })
  }
}
