import {Component, OnInit} from '@angular/core';
import {UpdateCustomerDto} from '../../model/customer-update-dto';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {Commune} from '../../model/commune';
import {District} from '../../model/district';
import {Province} from '../../model/province';
import {CreateCustomerService} from '../../service/create-customer.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Title} from '@angular/platform-browser';

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
  isExitsUser = false;
  isExitsEmail = false;
  isExitsPhone = false;
  provinceForm: FormGroup = new FormGroup({
    province: new FormControl('', Validators.required)
  });
  customerForm: FormGroup;

  constructor(private customerService: CreateCustomerService,
              private router: Router,
              private toast: ToastrService,
              private titleService: Title) {
    this.titleService.setTitle('Đăng ký tài khoản');
  }

  ngOnInit(): void {
    this.customerService.getAllProvince().subscribe(value => {this.provinceList = value; console.log(value); });
    this.customerForm =  new FormGroup({
      // tslint:disable-next-line:max-line-length
      name: new FormControl('', [Validators.pattern('^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\s?]+$'),
        Validators.required, this.notBlank, Validators.minLength(5), Validators.maxLength(50)]),
      dateOfBirth: new FormControl('', [Validators.required, this.check16Age]),
      email: new FormGroup({
        email: new FormControl('', [Validators.pattern('^[A-Za-z0-9]+@[A-Za-z0-9]+(\\.[A-Za-z0-9]+){1,2}$'), Validators.required])
      }),
      phoneNumber: new FormGroup({
        phone: new FormControl('', [Validators.pattern('^(0|84+)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$'),
          Validators.required])
      }),
      userName: new FormGroup({
        userName: new FormControl('', [Validators.required, this.notBlank, Validators.pattern('[a-zA-z0-9]{5,50}')])
      }),
      password: new FormGroup({
        // tslint:disable-next-line:max-line-length
        password: new FormControl('', [Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,50}'),
          Validators.required]),
        // tslint:disable-next-line:max-line-length
        confirmPassword: new FormControl('')
      }, this.checkConfirmPassword),
      province: new FormControl('', Validators.required),
      district: new FormControl('', Validators.required),
      commune: new FormControl('', Validators.required)
    });
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

  private notBlank(abstractControl: AbstractControl): any {
    // tslint:disable-next-line:variable-name
    const string: string = abstractControl.value;
    return (string.charAt(0) === ' ' || string.charAt(string.length - 1) === ' ') ? {notBlank: true} : null;
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
    return this.customerForm.get('phoneNumber').get('phone');
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

  submit() {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
    } else {
      this.updateCustomerDto = this.customerForm.value;
      this.updateCustomerDto.password = this.customerForm.value.password.password;
      this.customerService.createCustomer(this.updateCustomerDto).subscribe(
        value => {
          this.router.navigateByUrl('/sign-in');
          this.toast.success('Đăng ký thành công');
        }
      );
    }
    console.log(this.customerForm);
  }

  cancel() {
    this.customerForm = new FormGroup({
      id: new FormControl(),
      // tslint:disable-next-line:max-line-length
      name: new FormControl('', [Validators.pattern('^[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*(?:[ ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*)*$'),
        Validators.required, this.notBlank, Validators.minLength(5), Validators.maxLength(50)]),
      dateOfBirth: new FormControl('', [Validators.pattern('^[a-zA-Z\\s?]+$'), this.check16Age]),
      email: new FormGroup({
        email: new FormControl('', [Validators.pattern('^[A-Za-z0-9]+@[A-Za-z0-9]+(\\.[A-Za-z0-9]+){1,2}$'), Validators.required])
      }),
      phoneNumber: new FormGroup({
        // tslint:disable-next-line:max-line-length
        phone: new FormControl('', [Validators.pattern('^(0|84+)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$'), Validators.required])
      }),
      userName: new FormGroup({
        userName: new FormControl('', [Validators.required, this.notBlank, Validators.pattern('[a-zA-z0-9]{5,50}')])
      }),
      password: new FormGroup({
        // tslint:disable-next-line:max-line-length
        password: new FormControl('', [Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,50}'),
          Validators.required]),
        // tslint:disable-next-line:max-line-length
        confirmPassword: new FormControl('')
      }, this.checkConfirmPassword),
      province: new FormControl('', Validators.required),
      district: new FormControl('', Validators.required),
      commune: new FormControl('', Validators.required)
    });
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
