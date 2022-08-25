import {Component, OnInit} from '@angular/core';
import {EmployeeService} from '../../service/employee.service';
import {Employee} from '../../model/Employee';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {Position} from '../../model/Position';
import {Commune} from '../../model/Commune';
import {District} from '../../model/District';
import {AngularFireStorage} from '@angular/fire/storage';
import {Province} from '../../model/Province';
import {finalize} from 'rxjs/operators';
import {formatDate} from '@angular/common';
import {log} from 'util';
import {Router} from '@angular/router';

@Component({
  selector: 'app-employee-create',
  templateUrl: './employee-create.component.html',
  styleUrls: ['./employee-create.component.css']
})
export class EmployeeCreateComponent implements OnInit {

  employeeList: Employee[];
  positionList: Position[];
  communeList: Commune[];
  districtList: District[];
  provinceList: Province[];
  employee: Employee;
  check = true;
  url: any;
  msg = '';
  selectedFile: File = null;


  employeeForm = new FormGroup({
      code: new FormControl('', [Validators.required, Validators.pattern('^EMP[0-9]{4}$')]),
      name: new FormControl('', [Validators.required, Validators.pattern('^([A-Z][^A-Z0-9\\s]+)(\\s[A-Z][^A-Z0-9\\s]+)*$')]),
      email: new FormControl('', [Validators.required, Validators.email]),
      // tslint:disable-next-line:max-line-length
      phone: new FormControl('', [Validators.required, Validators.pattern('^(0|84+)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$')]),
      dob: new FormControl('', [Validators.required, this.check18Age]),
      salary: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(10)]),
      startWork: new FormControl('', [Validators.required]),
      statusDelete: new FormControl(0),
      image: new FormControl(''),
      appUser: new FormGroup({
        username: new FormControl('', [Validators.required, Validators.pattern('^[^ ][\\\\w\\\\W ]+[^ ]$')]),
        // tslint:disable-next-line:max-line-length
        password: new FormControl('', [Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$'), Validators.required]),
      }),
      position: new FormControl('', [Validators.required]),
      commune: new FormControl('', [Validators.required]),
      province: new FormControl('', Validators.required),
      district: new FormControl('', Validators.required)
    }, this.checkStartDate
  );



  constructor(private toastr: ToastrService,
              private employeeService: EmployeeService,
              private storage: AngularFireStorage,
              private route: Router) {
  }


  ngOnInit(): void {
    this.employeeService.getPositionList().subscribe(value => this.positionList = value);
    this.employeeService.getAllProvince().subscribe(value => this.provinceList = value);
  }

  getDistrictList($event: Event) {
    console.log('test');
    console.log($event);
    // @ts-ignore
    if ($event === '') {
      this.districtList = [];
      this.communeList = [];
    } else {
      this.employeeService.getDistrictsByProvinceId(Number($event)).subscribe(
        value => this.districtList = value);
    }
  }

  getCommuneList($event: Event) {
    console.log($event);
    // @ts-ignore
    if ($event === '') {
      this.communeList = [];
    } else {
      this.employeeService.getCommunesByDistrictId(Number($event)).subscribe(
        value => this.communeList = value);
    }
  }

  onFileSelected(event) {
    this.selectedFile = event.target.files[0];
  }

  createEmployee() {
    this.check = false;
    console.log(this.employeeForm);
    if (this.employeeForm.invalid) {
      this.toastr.error('Nhập đầy đủ thông tin.');
      this.check = true;
      return;
    }
    this.employeeForm.patchValue({createDate: this.getCurrentDateTime()});
    this.employeeForm.patchValue({views: 0});
    const nameImg = this.getCurrentDateTime() + this.selectedFile.name;
    const filePath = `employee/${nameImg}`;
    const fileRef = this.storage.ref(filePath);
    this.storage.upload(`employee/${nameImg}`, this.selectedFile).snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          this.employeeForm.patchValue({image: url});
          this.employeeService.create(this.employeeForm.value).subscribe(
            () => {
              this.toastr.success('Thêm mới thành công', 'Nhân Viên');
              this.route.navigateByUrl('/employees');
            }, (error => this.toastr.error('Thêm mới thất bại', 'Nhân Viên')),
            () => {
              this.ngOnInit();
            }
          );
        });
      })
    ).subscribe();
  }

  cancel() {
    this.toastr.error('Đã hủy bỏ');
    this.route.navigateByUrl('/employees');
  }



  getCurrentDateTime(): string {
    return formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss', 'en-US');
  }


  private check18Age(abstractControl: AbstractControl): any {
    if (abstractControl.value === '') {
      return null;
    }
    const today = new Date();
    const birthDate = new Date(abstractControl.value);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return (age >= 18) ? null : {not18: true};
  }

  checkStartDate(abstractControl: AbstractControl): any {
    const date = new Date(abstractControl.value.startWork);
    console.log(date + 'aaaaa');
    const now = new Date();
    console.log(date);
    console.log(now);
    if (date <= now) {
      return {dateerror: true};
    } else {
      return null;
    }
  }

  selectFile(event: any) {
    if (!event.target.files[0] || event.target.files[0].length === 0) {
      this.msg = 'You must select an image';
      return;
    }

    const mimeType = event.target.files[0].type;

    if (mimeType.match(/image\/*/) == null) {
      this.msg = 'Only images are supported';
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);


    // tslint:disable-next-line:variable-name
    reader.onload = (_event) => {
      this.msg = '';
      this.url = reader.result;
    };
  }
}
