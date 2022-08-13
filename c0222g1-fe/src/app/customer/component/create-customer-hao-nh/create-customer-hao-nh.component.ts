import {Component, DoCheck, OnInit} from '@angular/core';
import {UpdateCustomerDto} from '../../model/customer-update-dto';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {Commune} from '../../model/commune';
import {District} from '../../model/district';
import {Province} from '../../model/province';
import {CreateCustomerService} from '../../service/create-customer.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-create-customer-hao-nh',
  templateUrl: './create-customer-hao-nh.component.html',
  styleUrls: ['./create-customer-hao-nh.component.css']
})
export class CreateCustomerHaoNHComponent implements OnInit {
  updateCustomerDto: UpdateCustomerDto;
  provinceList: Province[];
  districtList: District[];
  communeList: Commune[];
  provinceForm: FormGroup = new FormGroup({
    province: new FormControl('', Validators.required)
  });
  customerForm: FormGroup = new FormGroup({
    id: new FormControl(),
    // tslint:disable-next-line:max-line-length
    name: new FormControl('', [Validators.pattern('^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\s?]+$'), Validators.required]),
    dateOfBirth: new FormControl('', [Validators.pattern('^[a-zA-Z\\s?]+$'), this.check16Age]),
    email: new FormGroup({
      email: new FormControl('', [Validators.pattern('^[A-Za-z0-9]+@[A-Za-z0-9]+(\\.[A-Za-z0-9]+){1,2}$'), Validators.required])
    }),
    phoneNumber: new FormGroup({
      phoneNumber: new FormControl('' , [Validators.pattern('^[0-9]{10,12}$'), Validators.required])
    }),
    userName: new FormGroup({
      userName: new FormControl('', Validators.required)
    }),
    password: new FormGroup({
      // tslint:disable-next-line:max-line-length
      password: new FormControl('', [Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$'), Validators.required]),
      confirmPassword: new FormControl('', Validators.required)
    }, this.checkConfirmPassword),
    province: new FormControl('', Validators.required),
    district: new FormControl('', Validators.required),
    commune: new FormControl('', Validators.required)
  });
  constructor(private customerService: CreateCustomerService,
              private router: Router) { }

  ngOnInit(): void {
    this.customerService.getAllProvince().subscribe(value => this.provinceList = value);
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

  private checkConfirmPassword(abstractControl: AbstractControl): any {
    const password = abstractControl.value.password;
    const confirmPassword = abstractControl.value.confirmPassword;
    return (password === confirmPassword) ? null : {notSame: true};
  }

  getUser() {
    return this.customerForm.get('userName').get('userName');
  }

  getPhone() {
    return this.customerForm.get('phoneNumber').get('phoneNumber');
  }

  getEmail() {
    return this.customerForm.get('email').get('email');
  }

  getPassword() {
    return this.customerForm.get('password').get('password');
  }

  getProvince() {
    return this.provinceForm.get('province').get('province');
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

  submit() {
    this.updateCustomerDto = this.customerForm.value;
    this.updateCustomerDto.password = this.customerForm.value.password.password;
    // this.customerService.createCustomer(this.updateCustomerDto).subscribe(
    //   value => {this.router.navigate('/'); }
    // )
  }
}
