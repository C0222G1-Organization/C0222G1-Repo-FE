import {Component, OnInit} from '@angular/core';
import {Computer} from '../../model/computer';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {ComputerService} from '../../service/computer.service';
import {ToastrService} from 'ngx-toastr';
import {ComputerTypeService} from '../../service/computer-type.service';
import {ComputerType} from '../../model/computer-type';
import {Router} from '@angular/router';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-computer-create',
  templateUrl: './computer-create.component.html',
  styleUrls: ['./computer-create.component.css']
})
export class ComputerCreateComponent implements OnInit {
  computerType: ComputerType[];
  computer: Computer[];
  control: FormControl;
  isExitsCode = false;
  isExitsLocation = false;
  formComputer = new FormGroup({
      id: new FormControl(),
      code: new FormControl('', [Validators.required,
        Validators.pattern('^(CP)[0-9]{4}$')]),
      status: new FormControl(1, Validators.required),
      location: new FormControl('', [Validators.required,
        Validators.pattern('^[A-Z][0-9]{4}$')]),
      startUsedDate: new FormControl('', [Validators.required, this.checkYear]),
      configuration: new FormControl('', [Validators.required, Validators.minLength(3),
        Validators.maxLength(20), Validators.pattern('^\\w+( \\w+)*$')]),
      manufacturer: new FormControl('', [Validators.required, Validators.minLength(1),
        Validators.maxLength(20)]),
      deleteStatus: new FormControl(0),
      warranty: new FormControl('', Validators.required),
      computerType: new FormGroup({
        id: new FormControl('', Validators.required)
      })
    }, this.checkStartDate
  );

  constructor(private computerService: ComputerService,
              private toast: ToastrService,
              private computerTypeService: ComputerTypeService,
              private route: Router,
              private title: Title) {
    this.title.setTitle('Trang thêm mới');
  }

  getAllComputerType() {
    this.computerTypeService.getAll().subscribe(value => {
      this.computerType = value;
      console.log(value);
    });
  }

  ngOnInit(): void {
    this.getAllComputerType();
  }

  checkStartDate(abstractControl: AbstractControl): any {
    const date = new Date(abstractControl.value.startUsedDate);
    const now = new Date();
    if (date > now) {
      return {dateerror: true};
    } else {
      return null;
    }
  }


  cancel() {
    this.toast.error('Sửa thất bại');
    this.route.navigateByUrl('/computers');
  }

  submitCreate() {
    const computer = this.formComputer.value;
    console.log(computer);
    for (const i of this.computerType) {
      if (i.id == computer.computerType.id) {
        computer.computerType.name = i.name;
        break;
      }
    }
    this.computerService.createComputer(this.formComputer.value).subscribe(value => {
      this.toast.success('Thêm mới thành công!');
      // this.formComputer.reset();
      this.route.navigateByUrl('/computers');
    });
  }

  checkYear(abstractControl: AbstractControl) {
    const sYear = abstractControl.value.substr(0, 4);
    console.log(sYear);
    return sYear >= 2000 ? null : {not2000: true};
  }

  checkCode($event: Event) {
    this.computerService.checkCode(String($event)).subscribe(
      value => {
        if (value) {
          this.isExitsCode = true;
        } else {
          this.isExitsCode = false;
        }
      }
    );
  }

  checkLocation($event: Event,
  ) {
    this.computerService.checkLocation(String($event)).subscribe(
      value => {
        if (value) {
          this.isExitsLocation = true;
        } else {
          this.isExitsLocation = false;
        }
      }
    );
  }

}
