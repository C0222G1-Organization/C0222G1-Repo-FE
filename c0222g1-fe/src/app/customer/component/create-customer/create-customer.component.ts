import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CustomerService} from '../../service/customer.service';
import {Province} from '../../model/province';
import {District} from '../../model/district';
import {Commune} from '../../model/commune';
import {ToastrService} from 'ngx-toastr';
import { UpdateCustomerDto } from '../../model/customer-update-dto';
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
  customerForm: FormGroup = new FormGroup({
    // tslint:disable-next-line:max-line-length
    name: new FormControl('', [Validators.pattern('^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨ' +
      'ƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜ' +
      'ỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\s?]+$'), Validators.required,
      Validators.minLength(5), Validators.maxLength(50), this.notBlank]),
    dateOfBirth: new FormControl('', [Validators.pattern('^[a-zA-Z\\s?]+$'), Validators.required, this.check16Age]),
    email: new FormGroup({
      email: new FormControl('', [Validators.pattern('^[A-Za-z0-9]+@[A-Za-z0-9]+(\\.[A-Za-z0-9]+){1,2}$'), Validators.required])
    }),
    phoneNumber: new FormGroup({
      phone: new FormControl('' , [Validators.pattern('^[0-9]{10,12}$'), Validators.required])
    }),
    userName: new FormGroup({
      userName: new FormControl('', [Validators.required, this.notBlank, Validators.pattern('[a-zA-z0-9]{5,50}') ])
    }),
    // tslint:disable-next-line:max-line-length
    password: new FormControl('', [Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$'), Validators.required]),
    activeStatus: new  FormControl(1),
    province: new FormControl('', Validators.required),
    district: new FormControl('', Validators.required),
    commune: new FormControl('', Validators.required)
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
      this.communeList = [];
    } else {
      this.customerService.getAllDistrict(Number($event)).subscribe(
        value => this.districtList = value);
    }
  }

  getCommuneList($event: Event) {
    // @ts-ignore
    if ($event === '') {
      this.communeList = [];
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
    console.log(this.customerForm);
    this.updateCustomerDto = this.customerForm.value;
    this.customerService.saveCustomer(this.updateCustomerDto).subscribe(
      value => {
        this.toast.success('Thêm mới khách hàng thành công!');
        this.route.navigateByUrl('/customers');
      },
      error => {
      }
    );
  }
  cancel() {
    this.customerForm.reset();
  }
  private check16Age(abstractControl: AbstractControl): any {
    const today = new Date();
    const birthDate = new Date(abstractControl.value);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return (age >= 16) ? null : {not16: true};
  }
  checkUserName($event: Event) {
    this.customerService.checkUserName(String($event)).subscribe(
      value => {
        if (value) {
          this.isExitsUser = true;
        }
      }
    );
    if (String($event) === '') {
      this.isExitsUser = false;
    }
  }

  checkEmail($event: Event) {
    if (String($event) === '') {
      this.isExitsEmail = false;
    }
    this.customerService.checkEmail(String($event)).subscribe(
      value => {
        if (value) {
          this.isExitsEmail = true;
        }
      }
    );
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
    console.log(this.isExitsPhone);
  }
}
