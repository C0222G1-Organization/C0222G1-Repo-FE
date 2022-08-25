import {Component, OnInit} from '@angular/core';
import {UpdateCustomerDto} from '../../model/customer-update-dto';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomerService} from '../../service/customer.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Province} from '../../model/province';
import {District} from '../../model/district';
import {Commune} from '../../model/commune';
import {ToastrService} from 'ngx-toastr';
import {Title} from '@angular/platform-browser';




@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.css']
})
export class EditCustomerComponent implements OnInit {
  // @ts-ignore
  // @ts-ignore
  customerEdit: UpdateCustomerDto = {
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
    }
  };
  provinceList: Province[];
  districtList: District[];
  communeList: Commune[];
  editCustomerForm: FormGroup;
  isExitsUser = false;
  isExitsEmail = false;
  isExitsPhone = false;
  isHiddenNewPassword = false;
  constructor(private customerService: CustomerService,
              private activatedRoute: ActivatedRoute,
              private route: Router,
              private toast: ToastrService,
              private titleService: Title) {
    this.titleService.setTitle('Chỉnh sửa thông tin khách hàng');
  }

  ngOnInit(): void {
    this.editCustomerForm = new FormGroup({
      name: new FormControl('', [Validators.pattern('^[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]' +
        '[a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*' +
        '(?:[ ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]' +
        '[a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*)*$'), Validators.required,
        Validators.minLength(5), Validators.maxLength(50), this.notBlank]),
      dateOfBirth: new FormControl('', [Validators.pattern('^[a-zA-Z\\s?]+$'), Validators.required, this.check16Age]),
      email: new FormGroup({email: new FormControl('', [Validators.pattern
        ('^[A-Za-z0-9]+@[A-Za-z0-9]+(\\.[A-Za-z0-9]+){1,2}$'), Validators.required, this.notBlank])
      }),
      phoneNumber: new FormGroup({
        phone: new FormControl('' , [Validators.pattern('^[0-9]{10,12}$'), Validators.required])
      }),
      userName: new FormGroup({
        userName: new FormControl('', [Validators.required, this.notBlank, Validators.pattern('[a-zA-z0-9]{5,50}') ])
      }),
      // tslint:disable-next-line:max-line-length
      password: new FormGroup({
        // tslint:disable-next-line:max-line-length
        password: new FormControl('', [Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$'), Validators.required]),
        confirmPassword: new FormControl('', Validators.required)
      }, this.checkConfirmPassword),
      activeStatus: new  FormControl(''),
      remainingTime: new FormControl(0, Validators.required),
      province: new FormGroup({
        id: new FormControl(0),
        name: new FormControl('', Validators.required),
      }),
      district: new FormGroup({
        id: new FormControl(0),
        name: new FormControl('', Validators.required)
      }),
      commune: new FormGroup({
        id: new FormControl(0),
        name: new FormControl('', Validators.required)
      }),
      oldPassword: new FormControl('', Validators.required)
    });
    const id = Number(this.activatedRoute.snapshot.params.id);
    this.customerService.getCustomerByID(id).subscribe(value => {
        this.customerEdit = value;
        this.editCustomerForm.patchValue(this.customerEdit);
        this.editCustomerForm.patchValue({district: value.commune.district});
        this.editCustomerForm.patchValue({province: value.commune.district.province});
      },
      error => {
      },
      () => {
        this.customerService.getAllProvince().subscribe(value => this.provinceList = value);
        this.customerService.getAllCommune(this.customerEdit.commune.district.id).subscribe(value => {
          this.communeList = value;
        });
        this.customerService.getAllDistrict(this.customerEdit.commune.district.province.id).subscribe(value => this.districtList = value);
      });
  }

  onsubmit() {
    const customerDTO: UpdateCustomerDto = this.editCustomerForm.value;
    customerDTO.id = this.customerEdit.id;
    customerDTO.userName.id = this.customerEdit.id;
    customerDTO.phoneNumber.id = this.customerEdit.id;
    customerDTO.email.id = this.customerEdit.id;
    if (this.editCustomerForm.value.password.password === '') {
      customerDTO.password = 'zxcxzczxczc!@!@#132';
    } else {
      customerDTO.password = this.editCustomerForm.value.password.password;
    }
    this.customerService.updateCustomerDTO(this.customerEdit.id, customerDTO).subscribe(res => {
      this.toast.success('Chỉnh sửa thông tin khách hàng thành công!');
      this.route.navigateByUrl('/customers');
      this.editCustomerForm.reset();
    }, error => {
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

   checkConfirmPassword(abstractControl: AbstractControl): any {
    const password = abstractControl.value.password;
    const confirmPassword = abstractControl.value.confirmPassword;
    return (password === confirmPassword) ? null : {notSame: true};
  }

  private notBlank(abstractControl: AbstractControl): any {
    // tslint:disable-next-line:variable-name
    const string: string = abstractControl.value;
    return (string.charAt(0) === ' ' || string.charAt(string.length - 1) === ' ') ? {notBlank: true} : null;
  }

  private check16Age(abstractControl: AbstractControl): any {
    if (abstractControl.value === '') {
      return null;
    }
    const today = new Date();
    const birthDate = new Date(abstractControl.value);
    if (birthDate === undefined) {
      return true;
    }
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return (age >= 16) ? null : {not16: true};
  }

  cancel() {
    this.route.navigateByUrl('/customers');
  }

  getUser() {
    return this.editCustomerForm.get('userName').get('userName');
  }

  getPhone() {
    return this.editCustomerForm.get('phoneNumber').get('phone');
  }

  getEmail() {
    return this.editCustomerForm.get('email').get('email');
  }

  getPassword() {
    return this.editCustomerForm.get('password');
  }

  getDistrictList($event: Event) {
    console.log($event);
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
    console.log($event);
    // @ts-ignore
    if ($event === '') {
      this.communeList = [];
    } else {
      this.customerService.getAllCommune(Number($event)).subscribe(
        value => {
          this.communeList = value;
          console.log(this.communeList);
        });
    }
  }

  checkEmail($event: Event) {
    if (String($event) === '' || String($event) === this.customerEdit.email.email) {
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
  showAndHidden() {
    if (this.isHiddenNewPassword) {
      this.isHiddenNewPassword = false;
    } else {
      this.isHiddenNewPassword = true;
    }
  }
}

