import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {ComputerService} from '../../service/computer.service';
import {ComputerTypeService} from '../../service/computer-type.service';
import {Computer} from '../../model/computer';
import {ComputerType} from '../../model/computer-type';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-computer-edit',
  templateUrl: './computer-edit.component.html',
  styleUrls: ['./computer-edit.component.css']
})
export class ComputerEditComponent implements OnInit {
  isExitsCode = false;
  isExitsLocation = false;
  formEditComputer = new FormGroup({
      id: new FormControl(),
      code: new FormControl('', [Validators.required,
        Validators.pattern('^(CP)[0-9]{4}$')]),
      status: new FormControl('', Validators.required),
      location: new FormControl('', [Validators.required,
        Validators.pattern('^[A-Z][0-9]{4}$')]),
      startUsedDate: new FormControl('', [Validators.required, this.checkYear]),
      configuration: new FormControl('', [Validators.required, Validators.pattern('^\\w+( \\w+)*$')]),
      manufacturer: new FormControl('', [Validators.required, Validators.minLength(1),
        Validators.maxLength(20)]),
      deleteStatus: new FormControl(''),
      warranty: new FormControl('', Validators.required),
      computerType: new FormGroup({
        id: new FormControl('', Validators.required),
      })

    }, this.checkStartDate
  );
  id: number;
  computerType: ComputerType[];

  constructor(private computerService: ComputerService,
              private computerTypeService: ComputerTypeService,
              private activatedRoute: ActivatedRoute,
              private toast: ToastrService,
              private route: Router,
              private title: Title) {
    this.title.setTitle('Trang chỉnh sửa');
  }

  ngOnInit(): void {
    this.id = Number(this.activatedRoute.snapshot.params.id);
    this.getAll();
    this.findById(this.id);
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
    });
  }

  findById(id) {
    this.computerService.findById(id).subscribe(value => {
      this.formEditComputer.patchValue(value);
      console.log(value);
    }, error => {
      this.route.navigateByUrl('/500');
    });
  }

  cancel() {
    this.toast.error('Sửa thất bại');
    this.route.navigateByUrl('/computers');
  }

  submit() {
    this.computerService.editComputer(this.id, this.formEditComputer.value).subscribe(value => {
        this.toast.success('Sửa thành công');
        this.route.navigateByUrl('/computers');
      },
      error => {
        this.toast.error('Sửa thất bại');
      });
  }

  checkYear(abstractControl: AbstractControl) {
    const sYear = abstractControl.value.substr(6, 9);
    // const curYear=new Date().getFullYear()
    return sYear <= 2000 ? null : {not2000: true};
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

  checkLocation($event: Event) {
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
