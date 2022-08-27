import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {EmployeeService} from '../../service/employee.service';
import {AngularFireStorage} from '@angular/fire/storage';
import {Router} from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import {Position} from '../../model/position';
import {Commune} from '../../model/commune';
import {District} from '../../model/district';
import {Province} from '../../model/province';
import {Employee} from '../../model/employee';
import {finalize} from 'rxjs/operators';
import {formatDate} from '@angular/common';
import {AppUser} from '../../model/appuser';

@Component({
  selector: 'app-employee-update',
  templateUrl: './employee-update.component.html',
  styleUrls: ['./employee-update.component.css']
})
export class EmployeeUpdateComponent implements OnInit {
  positionList: Position[];
  communeList: Commune[];
  districtList: District[];
  provinceList: Province[];
  // @ts-ignore
  // tslint:disable-next-line:align
  employee: Employee = {};
  // @ts-ignore
  appUser: AppUser = {};
  id: number;
  idDistrict: number;

  url: any;
  msg = '';
  selectedFile: File = null;
  checkImage = false;
  check = true;

  employeeFormEdit = new FormGroup({
      code: new FormControl(this.employee.code, [Validators.required]),
      // tslint:disable-next-line:max-line-length
      name: new FormControl(this.employee.name, [Validators.required, Validators.pattern('^[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*(?:[ ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*)*$')]),
      email: new FormControl(this.employee.email, [Validators.required, Validators.email]),
      // tslint:disable-next-line:max-line-length
      phone: new FormControl(this.employee.phone, [Validators.required, Validators.pattern('^(0|84+)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$')]),
      dob: new FormControl(this.employee.dob, [Validators.required, this.check18Age]),
      // tslint:disable-next-line:max-line-length
      salary: new FormControl(this.employee.salary, [Validators.required, Validators.minLength(5), Validators.maxLength(10)]),
      startWork: new FormControl(this.employee.startWork, [Validators.required]),
      statusDelete: new FormControl(0, [Validators.required]),
      image: new FormControl(this.employee.image),
      appUser: new FormGroup({
        username: new FormControl(this.appUser.username, Validators.required),
        // tslint:disable-next-line:max-line-length
        password: new FormControl(this.appUser.password, [Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$'), Validators.required]),
      }),
      position: new FormControl(this.employee.position, [Validators.required]),
      commune: new FormGroup({
        id: new FormControl(),
        name: new FormControl()
      }),
      district: new FormGroup({
        id: new FormControl(),
        name: new FormControl()
      }),
      province: new FormGroup({
        id: new FormControl(),
        name: new FormControl()
      })
    }, this.checkStartDate
  );

  constructor(private toastr: ToastrService,
              private employeeService: EmployeeService,
              private activatedRoute: ActivatedRoute,
              private storage: AngularFireStorage,
              private route: Router) {
  }

  ngOnInit(): void {
    this.id = Number(this.activatedRoute.snapshot.params.id);
    this.findEmployeeById(this.id);
    this.employeeService.getPositionList().subscribe(value => {
      this.positionList = value;
    });
    this.getAllProvince();
  }

  findEmployeeById(id) {
    this.employeeService.findByIdEmployee(id).subscribe(value => {
      this.employee = value;
      console.log(this.employee);
      this.employeeFormEdit.patchValue(value);
      this.employeeFormEdit.patchValue({commune: this.employee.commune});
      this.employeeFormEdit.patchValue({district: this.employee.commune.district});
      this.employeeFormEdit.patchValue({province: this.employee.commune.district.province});
      console.log(this.employeeFormEdit);
      this.getDistrictsByProvinceId();
      this.getCommunesByDistrictId();
    });
  }

  getAllProvince() {
    this.employeeService.getAllProvince().subscribe(value => {
      this.provinceList = value;
      console.log(this.provinceList);
    });
  }

  getDistrictsByProvinceId() {
    this.employeeService.getDistrictsByProvinceId(this.employee.commune.district.province.id).subscribe(value => {
      this.districtList = value;
    });
  }

  getCommunesByDistrictId() {
    this.employeeService.getCommunesByDistrictId(this.employee.commune.district.id).subscribe(value => {
      this.communeList = value;
      console.log(this.communeList);
    });
  }


  getCommuneList($event: Event) {
    // @ts-ignore
    if ($event === '') {
      this.communeList = [];
    } else {
      this.employeeService.getCommunesByDistrictId(Number($event)).subscribe(
        value => this.communeList = value);
      console.log(this.communeList);
    }
  }

  getDistrictList($event: Event) {
    // @ts-ignore
    if ($event === '') {
      this.districtList = [];
      this.communeList = [];
    } else {
      this.employeeService.getDistrictsByProvinceId(Number($event)).subscribe(
        districts => {
          this.districtList = districts;
          this.employeeService.getCommunesByDistrictId(this.districtList[0].id).subscribe(
            communes => this.communeList = communes);
        });
    }
  }

  onFileSelected(event) {
    this.checkImage = true;
    this.selectedFile = event.target.files[0];
    return;
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

  cancel() {
    this.toastr.error('Đã hủy bỏ');
    this.route.navigateByUrl('/employees');
  }


  submitEmployee() {
    this.employeeFormEdit.patchValue({createDate: this.getCurrentDateTime()});
    this.employeeFormEdit.patchValue({views: 0});
    const nameImg = this.getCurrentDateTime() + this.selectedFile.name;
    const filePath = `employee/${nameImg}`;
    const fileRef = this.storage.ref(filePath);
    this.storage.upload(`employee/${nameImg}`, this.selectedFile).snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          this.employeeFormEdit.patchValue({image: url});
          this.employeeService.editEmployee(this.id, this.employeeFormEdit.value).subscribe(
            () => {
              this.toastr.success('Lưu thành công');
              this.route.navigateByUrl('/employees');
            }, (error => this.toastr.error('Sửa thất bại')),
            () => {
              this.ngOnInit();
            }
          );
        });
      })
    ).subscribe();
  }

  compareWithId(item1, item2) {
    return item1 && item2 && item1.id === item2.id;
  }
}
