import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CustomerService} from '../../service/customer.service';
import {Province} from '../../model/province';
import {District} from '../../model/district';
import {Commune} from '../../model/commune';
import {ToastrService} from 'ngx-toastr';
import {UpdateCustomerDto} from '../../model/customer-update-dto';
import {Title} from '@angular/platform-browser';


@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.css']
})
export class CreateCustomerComponent implements OnInit {
  updateCustomerDto: UpdateCustomerDto;
  provinceList: Province[];
  districtList: District[];
  communeList: Commune[];
  isExitsUser = false;
  isExitsEmail = false;
  isExitsPhone = false;
  check = true;
  customerForm: FormGroup = new FormGroup({
    // tslint:disable-next-line:max-line-length
    name: new FormControl('', [Validators.pattern('^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨ' +
      'ƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜ' +
      'ỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\s?]+$'), Validators.required,
      Validators.minLength(5), Validators.maxLength(50), this.notBlank]),
    dateOfBirth: new FormControl('', [Validators.pattern('^[a-zA-Z\\s?]+$'), Validators.required, this.check16Age]),
    email: new FormGroup({email: new FormControl('', [Validators.pattern(
      '^[A-Za-z0-9]+@[A-Za-z0-9]+(\\.[A-Za-z0-9]+){1,2}$'), Validators.required, this.notBlank])
    }),
    phoneNumber: new FormGroup({
      // tslint:disable-next-line:max-line-length
      phone: new FormControl('', [Validators.pattern('^(0|84+)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$'),
        Validators.required])
    }), userName: new FormGroup({
      userName: new FormControl('', [Validators.required,
        this.notBlank, Validators.pattern('[a-zA-z0-9]{5,50}'), Validators.minLength(5), Validators.maxLength(50)])
    }),
    // tslint:disable-next-line:max-line-length
    password: new FormControl('', [Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$'), Validators.required, Validators.minLength(5), Validators.maxLength(50)]),
    activeStatus: new FormControl(1),
    province: new FormControl('', Validators.required),
    district: new FormControl('', Validators.required),
    commune: new FormControl('', Validators.required),
    remainingTime: new FormControl('', Validators.required)
  });

  constructor(private activatedRoute: ActivatedRoute,
              private route: Router,
              private customerService: CustomerService,
              private toast: ToastrService,
              private title: Title) {
    this.title.setTitle('Thêm mới khách hàng');
  }

  ngOnInit(): void {
    this.customerService.getAllProvince().subscribe(value => this.provinceList = value);
  }

  getUser() {
    return this.customerForm.get('userName').get('userName');
  }

  getPhone() {
    return this.customerForm.get('phoneNumber').get('phone');
  }

  getEmail() {
    return this.customerForm.get('email').get('email');
  }

  getPassword() {
    return this.customerForm.get('password');
  }

  getDistrictList($event: Event) {
    // @ts-ignore
    if ($event === '') {
      this.districtList = [];
      this.customerForm.get('district').setValue('');
      this.communeList = [];
      this.customerForm.get('commune').setValue('');
    } else {
      this.customerService.getAllDistrict(Number($event)).subscribe(
        value => {
          this.districtList = value;
          this.customerForm.get('district').setValue('');
          this.customerForm.get('commune').setValue('');
        });
    }
  }

  getCommuneList($event: Event) {
    // @ts-ignore
    if ($event === '') {
      this.communeList = [];
      this.customerForm.get('commune').setValue('');
    } else {
      this.customerService.getAllCommune(Number($event)).subscribe(
        value => this.communeList = value);
    }
  }

  private notBlank(abstractControl: AbstractControl): any {
    // tslint:disable-next-line:variable-name
    const string: string = abstractControl.value;
    return (string.charAt(0) === ' ' || string.charAt(string.length - 1) === ' ') ? {notBlank: true} : null;
  }

  submit() {
    this.check = false;
    this.updateCustomerDto = this.customerForm.value;
    this.updateCustomerDto.remainingTime = this.updateCustomerDto.remainingTime * 60;
    this.customerService.saveCustomer(this.updateCustomerDto).subscribe(
      value => {
        this.toast.success('Thêm mới khách hàng thành công!');
        this.route.navigateByUrl('/customers');
      },
      error => {
        if (this.customerForm.invalid) {
          this.toast.error('Nhập đầy đủ thông tin.');
          this.check = true;
          return;
        }
      }
    );
  }

  cancel() {
    this.route.navigateByUrl('/customers');
  }

  private check16Age(abstractControl: AbstractControl): any {
    if (abstractControl.value === '') {
      return null;
    }
    const today = new Date();
    const birthDate = new Date(abstractControl.value);
    if (birthDate === undefined) {
      return null;
    }
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age <= 16) {
      return {not16: true};
    } else if (age >= 100) {
      return {after100: true};
    } else {
      return null;
    }
  }

  checkUserName($event: Event) {
    this.customerService.checkUserName(String($event)).subscribe(
      value => {
        this.isExitsUser = !!value;
      }
    );
    if (String($event) === '') {
      this.isExitsUser = false;
    }
  }

  checkEmail($event: Event) {
    this.customerService.checkEmail(String($event)).subscribe(
      value => {
        console.log(value);
        if (value) {
          this.isExitsEmail = true;
        } else {
          this.isExitsEmail = false;
        }
      }
    );
    if (String($event) === '') {
      this.isExitsEmail = false;
    }
  }

  checkPhone($event: Event) {
    this.customerService.checkPhone(String($event)).subscribe(
      value => {
        if (value) {
          this.isExitsPhone = true;
        } else {
          this.isExitsPhone = false;
        }
      }
    );
    if (String($event) === '') {
      this.isExitsPhone = false;
    }
  }
}
