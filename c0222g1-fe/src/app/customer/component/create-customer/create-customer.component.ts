import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CustomerService} from '../../service/customer.service';
import {Province} from '../../model/province';
import {District} from '../../model/district';
import {Commune} from '../../model/commune';
import {ToastrService} from 'ngx-toastr';
import { UpdateCustomerDto } from '../../model/customer-update-dto';


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
  customerForm: FormGroup = new FormGroup({
    // tslint:disable-next-line:max-line-length
    name: new FormControl('', [Validators.pattern('^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\s?]+$'), Validators.required]),
    dateOfBirth: new FormControl('', [Validators.pattern('^[a-zA-Z\\s?]+$'), Validators.required, this.check16Age]),
    email: new FormGroup({
      email: new FormControl('', [Validators.pattern('^[A-Za-z0-9]+@[A-Za-z0-9]+(\\.[A-Za-z0-9]+){1,2}$'), Validators.required])
    }),
    phoneNumber: new FormGroup({
      phone: new FormControl('' , [Validators.pattern('^[0-9]{10,12}$'), Validators.required])
    }),
    userName: new FormGroup({
      userName: new FormControl('', Validators.required)
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
              private toast: ToastrService) {
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

  submit() {
    console.log(this.customerForm);
    this.updateCustomerDto = this.customerForm.value;
    this.customerService.saveCustomer(this.updateCustomerDto).subscribe(
      value => {
        this.toast.success('Thêm mới khách hàng thành công!');
        this.route.navigateByUrl('/listCustomer');
      },
      error => {
        if (error.error.email !== undefined) {
          this.toast.error(error.error.email);
        }
        if (error.error.userName !== undefined) {
          this.toast.error(error.error.userName);
        }
        if (error.error.phoneNumber !== undefined) {
          this.toast.error(error.error.phoneNumber);
        }
      }
    );
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

}
