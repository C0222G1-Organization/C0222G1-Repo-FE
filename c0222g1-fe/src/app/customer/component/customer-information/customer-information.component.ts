import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomerService} from '../../service/customer.service';
import {Province} from '../../model/province';
import {District} from '../../model/district';
import {Commune} from '../../model/commune';
import {CreateCustomerService} from '../../service/create-customer.service';
import {UpdateCustomerDto} from '../../model/customer-update-dto';
import {Title} from '@angular/platform-browser';
import {ToastrService} from 'ngx-toastr';
import {isDate} from 'rxjs/internal-compatibility';
import {AuthService} from '../../../authentication/service/auth.service';
import {CustomValidators} from './custom-validators';
import {UpdateCustomer} from '../../model/update-customer';

@Component({
  selector: 'app-customer-information',
  templateUrl: './customer-information.component.html',
  styleUrls: ['./customer-information.component.css']
})
export class CustomerInformationComponent implements OnInit {
  content = '';
  oldPassword: string;
  fakePassword = 'zxcxzczxczc!@!@#132';
  oldPasswordToEdit: string;
  isEditPassword = false;
  matchOldPass: boolean;
  openPasswordToEdit: boolean;
  isExitsEmail = false;
  isExitsPhone = false;
  inputType: string;
  confirmInputType: string;
  typePassword = false;
  typeConfirmPassword = false;
  checkToSave = false;

  endTimeMillisecs: any;
  cDateMillisecs: any;
  currentDate: any;
  difference: any;
  secondss: any;
  minutess: any;
  hourss: any;
  dayss: any;
  loop: any;
  countRequest = 1;
  endTime: Date;

  customer: UpdateCustomerDto = {
    id: 0,
    name: '',
    dateOfBirth: '',
    email: {
      id: 0,
      email: ''
    },
    phoneNumber: {
      id: 0,
      phone: ''
    },
    userName: {
      id: 0,
      name: ''
    },
    password: '',
    activeStatus: 0,
    commune: {
      id: 0,
      name: '',
      district: {
        id: 0,
        name: '',
        province: {
          id: 0,
          name: ''
        }
      }
    },
    remainingTime: 0
  };
  provinceList: Province[];
  districtList: District[];
  communeList: Commune[];
  customerForm: FormGroup;

  constructor(private activatedRoute: ActivatedRoute,
              private route: Router,
              private customerService: CustomerService,
              private createCustomerService: CreateCustomerService,
              private toast: ToastrService,
              private title: Title,
              private authService: AuthService) {
    this.title.setTitle('Thông tin cá nhân');
  }


  ngOnInit(): void {
    this.loadInfoCustomer();
    this.endTime = this.convertStringToDate(localStorage.getItem('startTime'));
    this.endTime.setSeconds(this.endTime.getSeconds() + Number(localStorage.getItem('remainingTime')));
    this.countDownDate();
  }

  /**
   * Create by: DuyNT
   * Date Create: 11/08/2022
   * function: load customer form DB
   */
  loadInfoCustomer() {
    this.customerForm = new FormGroup({
      // tslint:disable-next-line:max-line-length
      name: new FormControl('', [Validators.pattern('^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêêềễìíứừựớờợòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\s?]+$'), Validators.required]),
      dateOfBirth: new FormControl('', [this.check16Age, this.checkDateNotExist]),
      email: new FormGroup({
        id: new FormControl(0),
        email: new FormControl('', [Validators.pattern('^[A-Za-z0-9]+@[A-Za-z0-9]+(\\.[A-Za-z0-9]+){1,2}$'), Validators.required])
      }),
      phoneNumber: new FormGroup({
        id: new FormControl(0),
        phone: new FormControl('', [Validators.pattern('^(09|03\\(\\+84\\)9|\\(\\+84\\)9)\\d{8}$'), Validators.required])
      }),
      userName: new FormGroup({
        id: new FormControl(0),
        userName: new FormControl('', Validators.required)
      }),
      // tslint:disable-next-line:max-line-length
      oldPassword: new FormControl('', [Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,50}'), Validators.required]),
      // tslint:disable-next-line:max-line-length
      password: new FormControl('', [Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,50}'), Validators.required]),
      // tslint:disable-next-line:max-line-length
      confirmPassword: new FormControl('', [Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,50}'), Validators.required]),
      activeStatus: new FormControl(''),
      province: new FormGroup({
        id: new FormControl(0, [Validators.required]),
        name: new FormControl('', Validators.required),
      }),
      district: new FormGroup({
        id: new FormControl(0, Validators.required),
        name: new FormControl('', Validators.required)
      }),
      commune: new FormGroup({
        id: new FormControl(0, Validators.required),
        name: new FormControl('', Validators.required)
      })
    }, [CustomValidators.mustMatch('password', 'confirmPassword')]);
    if (localStorage.getItem('token')) {
      const id = localStorage.getItem('customerId');
      this.customerService.getCustomerByID(Number(id)).subscribe(value => {
          this.customer = value;
          console.log(value);
          console.log('value');
          // alert(value.userName.userName);
          this.oldPassword = this.customer.password;
          this.customer.password = '';
          this.customerForm.patchValue(this.customer);
          this.customerForm.patchValue({district: value.commune.district});
          this.customerForm.patchValue({province: value.commune.district.province});
        }
        ,
        error => {
          this.toast.error('KHÔNG CÓ THÔNG TIN');
        },
        () => {
          this.customerService.getAllProvince().subscribe(value => {
            this.provinceList = value;
          });
          this.customerService.getAllCommune(this.customer.commune.district.id).subscribe(value => {
            this.communeList = value;
          });
          this.customerService.getAllDistrict(this.customer.commune.district.province.id).subscribe(value => this.districtList = value);
        });
    }
  }

  private check16Age(abstractControl: AbstractControl): any {
    if (abstractControl.value !== '') {
      const today = new Date();
      const birthDate = new Date(abstractControl.value);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return (age >= 16) ? null : {not16: true};
    } else {
      return {noneValue: true};
    }
  }

  checkDateNotExist(abstractControl: AbstractControl) {
    if (abstractControl.value !== '') {
      const v = abstractControl.value;
      const start = new Date(v);
      if (!isDate(start)) {
        return {dateNotExist: true};
      }
    } else {
      return {dateNotExist: false};
    }
  }

  checkPhone($event: Event) {
    this.customerService.checkPhone(String($event)).subscribe(
      value => {
        if (value) {
          this.isExitsPhone = true;
        }
      }
    );
    if (String($event) === '') {
      this.isExitsPhone = false;
    }
  }

  getPhone() {
    return this.customerForm.get('phoneNumber').get('phone');
  }

  getEmail() {
    return this.customerForm.get('email').get('email');
  }

  getDistrictList($event: Event) {
    // @ts-ignore
    if ($event === '') {
      this.districtList = [];
      this.communeList = [];
    } else {
      this.customerService.getAllDistrict(Number($event)).subscribe(
        value => {
          this.districtList = value;
          for (let i = 0; i - 1 < this.districtList.length - 1; i++) {
            this.customerService.getAllCommune(this.districtList[i].id).subscribe(value1 => {
              for (let j = 0; j - 1 < value1.length - 1; j++) {
                this.communeList.push(value1[i]);
              }
            });
          }
        });
    }
  }

  getCommuneList($event: Event) {
    // @ts-ignore
    if ($event === '') {
      this.communeList = [];
    } else {
      this.customerService.getAllCommune(Number($event)).subscribe(
        value => {
          this.communeList = value;
        });
    }
  }

  checkEmail($event: Event) {
    this.isExitsEmail = false;
    if (String($event) === '' || String($event) === this.customer.email.email) {
      this.isExitsEmail = false;
    } else {
      this.customerService.checkEmail(String($event)).subscribe(
        value => {
          if (value) {
            this.isExitsEmail = true;
          }
        }
      );
    }
  }

  /**
   * Create by: DuyNT
   * Date Create: 11/08/2022
   * function: active edit on each input item
   */
  activeEdit(item: any) {
    if (item === this.fakePassword) {
      this.isEditPassword = true;
    }
    this.openPasswordToEdit = true;
    this.typePassword = true;
    this.typeConfirmPassword = true;
    this.content = item;
    this.setType();
    this.setConfirmType();
  }

  /**
   * Create by: DuyNT
   * Date Create: 11/08/2022
   * function: set type to show or hidden password
   */
  setType() {
    this.typePassword = !this.typePassword;
    if (this.typePassword === false) {
      this.inputType = 'password';
    } else {
      this.inputType = 'text';
    }
  }

  /**
   * Create by: DuyNT
   * Date Create: 11/08/2022
   * function: set type to show or hidden confirm password
   */
  setConfirmType() {
    this.typeConfirmPassword = !this.typeConfirmPassword;
    if (this.typeConfirmPassword === false) {
      this.confirmInputType = 'password';
    } else {
      this.confirmInputType = 'text';
    }
  }

  convertStringToDate(dateString: string): Date {
    const [timeComponents, dateComponents] = dateString.split(' ');
    const [day, month, year] = dateComponents.split('-');
    const [hours, minutes, seconds] = timeComponents.split(':');
    const date = new Date(+year, +month - 1, +day, +hours, +minutes, +seconds);
    return date;
  }

  countDownDate() {
    this.loop = setInterval(() => {
      this.currentDate = new Date();
      this.cDateMillisecs = this.currentDate.getTime();
      this.endTimeMillisecs = this.endTime.getTime();
      this.difference = this.endTimeMillisecs - this.cDateMillisecs;
      this.secondss = Math.floor(this.difference / 1000);
      this.minutess = Math.floor(this.secondss / 60);
      this.hourss = Math.floor(this.minutess / 60);
      this.dayss = Math.floor(this.hourss / 24);

      this.hourss %= 24;
      this.minutess %= 60;
      this.secondss %= 60;

      this.hourss = this.hourss < 10 ? '0' + this.hourss : this.hourss;
      this.minutess = this.minutess < 10 ? '0' + this.minutess : this.minutess;
      this.secondss = this.secondss < 10 ? '0' + this.secondss : this.secondss;

      if (this.difference < 1000) {
        clearInterval(this.loop);
        localStorage.removeItem('token');
        localStorage.removeItem('roles');
        localStorage.removeItem('username');
        localStorage.removeItem('milisecsEndTime');
        this.authService.sendData('login', false);
        this.toast.error('Tài khoản hết giờ');
        this.authService.setOutOfTime(Number(localStorage.getItem('customerId')), 0).subscribe(value => {
          this.authService.returnComputer(Number(localStorage.getItem('computerId'))).subscribe();
          this.route.navigate(['']);
        }, error => {
          this.toast.error('Lỗi tài khoản hết giờ');
          this.route.navigate(['']);
        });
      }

      if (this.countRequest >= 10) {
        localStorage.setItem('remainingTime', String(Math.trunc(this.difference / 1000)));

        this.authService.setOutOfTime(Number(localStorage.getItem('customerId')), Math.trunc(this.difference / 1000)).subscribe(value => {
          // this.toartrs.success('đã update remaining time với server');
        }, error => {
          this.toast.error('Lỗi kết nối server: set out of time');
        });
        this.countRequest = 1;
      } else {
        this.countRequest++;
      }

    }, 1000);
  }


  onsubmit() {
    this.checkBeforeSaving();
    if (this.customerForm.value.password !== '' && this.customerForm.value.password === this.customerForm.value.confirmPassword) {
      this.checkToSave = true;
    }
    if (this.checkToSave) {
      const customerDTO: UpdateCustomer = this.customerForm.value;
      if (this.customerForm.value.password === '') {
        customerDTO.password = this.fakePassword;
      }
      customerDTO.id = this.customer.id;
      this.customerService.updateCustomerInfo(this.customer.id, customerDTO).subscribe(res => {
        if (this.isEditPassword === true && this.customerForm.value.oldPassword === '') {
          this.toast.success('Giữ nguyên mật khẩu cũ.');
        } else if (this.isEditPassword === true && this.customerForm.value.password === '') {
          this.toast.success('Giữ nguyên mật khẩu cũ.');
        } else {
          this.toast.success('Cập nhật thành công.');
        }
        this.loadInfoCustomer();
        this.openPasswordToEdit = false;
        this.content = '';
        this.matchOldPass = undefined;
        this.isEditPassword = false;
        this.checkToSave = false;
      }, error => {
        this.toast.error('Cập nhật không thành công.');
        if (error.error.email !== undefined) {
          this.toast.error(error.error.email);
        }
        if (error.error.userName !== undefined) {
          this.toast.error(error.error.userName);
        }
        if (error.error.phoneNumber !== undefined) {
          this.toast.error(error.error.phoneNumber);
        }
      });
    }
  }

  checkOldPassword(oldPassword: any) {
    this.oldPasswordToEdit = oldPassword;
    if (oldPassword !== '') {
      this.customerService.checkMatchesPassword(this.oldPasswordToEdit, this.customer.id).subscribe(result => {
        if (result) {
          this.matchOldPass = true;
          this.checkToSave = false;
          this.openPasswordToEdit = false;
          this.content = this.fakePassword;
        } else {
          this.matchOldPass = false;
          this.checkToSave = false;
        }
      });
    } else {
      this.checkToSave = true;
    }
  }

  checkBeforeSaving() {
    if (this.customerForm.value.oldPassword !== '') {
      this.checkOldPassword(this.customerForm.value.oldPassword);
      if (this.checkToSave === false) {
        return true;
      }
    } else if (this.customerForm.value.oldPassword === '') {
      this.checkToSave = true;
    }
    if (this.customerForm.value.password !== '' && this.customerForm.value.password === this.customerForm.value.confirmPassword) {
      this.checkToSave = true;
    } else if (this.customerForm.value.password === '' && this.customerForm.value.password === this.customerForm.value.confirmPassword) {
      this.checkToSave = true;
    }
  }
}



