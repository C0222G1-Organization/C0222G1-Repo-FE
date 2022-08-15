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

@Component({
  selector: 'app-customer-information',
  templateUrl: './customer-information.component.html',
  styleUrls: ['./customer-information.component.css']
})
export class CustomerInformationComponent implements OnInit {
  content = '';
  inputType: string;
  confirmInputType: string;
  typePassword = false;
  typeConfirmPassword = false;
  hour: any;
  minutes: any;

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
              private title: Title) {
    this.title.setTitle('THÔNG TIN CÁ NHÂN');
  }


  ngOnInit(): void {
    this.loadInfoCustomer();
  }

  /**
   * Create by: DuyNT
   * Date Create: 11/08/2022
   * function: load customer form DB
   */
  loadInfoCustomer() {
    this.customerForm = new FormGroup({
      // tslint:disable-next-line:max-line-length
      name: new FormControl('', [Validators.pattern('^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\s?]+$'), Validators.required]),
      dateOfBirth: new FormControl('', [this.check16Age]),
      email: new FormGroup({
        id: new FormControl(0),
        email: new FormControl('', [Validators.pattern('^[A-Za-z0-9]+@[A-Za-z0-9]+(\\.[A-Za-z0-9]+){1,2}$'), Validators.required])
      }),
      phoneNumber: new FormGroup({
        id: new FormControl(0),
        phone: new FormControl('', [Validators.pattern('^[0-9]{10,12}$'), Validators.required])
      }),
      userName: new FormGroup({
        id: new FormControl(0),
        userName: new FormControl('', Validators.required)
      }),
      // tslint:disable-next-line:max-line-length
      password: new FormControl('', [Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$'), Validators.required]),
      activeStatus: new FormControl(''),
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
      })
    });
    const id = 1;
    this.customerService.getCustomerByID(id).subscribe(value => {
        this.customer = value;
        console.log(value);
        console.log('here');
        this.customerForm.patchValue(this.customer);
        this.customerForm.patchValue({district: value.commune.district});
        this.customerForm.patchValue({province: value.commune.district.province});
        console.log(this.customerForm);
      },
      error => {
        console.log('error');
      },
      () => {
        this.customerService.getAllProvince().subscribe(value => {
          console.log('thành phố');
          console.log(value);
          this.provinceList = value;
        });
        this.customerService.getAllCommune(this.customer.commune.district.id).subscribe(value => {
          console.log('phường');
          console.log(value);
          this.communeList = value;
        });
        this.customerService.getAllDistrict(this.customer.commune.district.province.id).subscribe(value => this.districtList = value);
        this.minutes = this.customer.remainingTime % 60;
        if (this.minutes < 10) {
          this.minutes = '0' + this.minutes;
        }
        this.hour = (this.customer.remainingTime - this.minutes) / 60;
        if (this.hour < 10) {
          this.hour = '0' + this.hour;
        }
      });
    // if (sessionStorage.getItem('token')) {
    //   const customerId = sessionStorage.getItem('customerId');
    //   this.customerService.getCustomerByID(Number(customerId)).subscribe(value => {
    //     console.log(value);
    //     this.customerForm.patchValue(value);
    //     this.customer = value;
    //     // console.log(this.customer);
    //     this.minutes = this.customer.remainingTime % 60;
    //     if (this.minutes < 10) {
    //       this.minutes = '0' + this.minutes;
    //     }
    //     this.hour = (this.customer.remainingTime - this.minutes) / 60;
    //     if (this.hour < 10) {
    //       this.hour = '0' + this.hour;
    //     }
    //     // console.log(this.customer.user.password);
    //   });
    // }
  }

  onsubmit() {
    console.log(this.customerForm.value);
    const customerDTO = this.customerForm.value;
    customerDTO.id = this.customer.id;
    this.customerService.updateCustomer(this.customer.id, this.customerForm.value).subscribe(res => {
      this.toast.success('CHỈNH SỬA THÀNH CÔNG!');
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

  compareCommuneId(item1, item2) {
    return item1 && item2 && item1.id === item2.id;
  }

  /**
   * Create by: DuyNT
   * Date Create: 11/08/2022
   * function: active edit on each input item
   */
  activeEdit(item: any) {
    this.typePassword = true;
    this.typeConfirmPassword = true;
    console.log(item);
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
    console.log(this.typePassword);
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
    console.log(this.typeConfirmPassword);
    this.typeConfirmPassword = !this.typeConfirmPassword;
    if (this.typeConfirmPassword === false) {
      this.confirmInputType = 'password';
    } else {
      this.confirmInputType = 'text';
    }
  }
}
