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

  constructor(private customerService: CustomerService,
              private activatedRoute: ActivatedRoute,
              private route: Router,
              private toast: ToastrService,
              private titleService: Title) {
    this.titleService.setTitle('Chỉnh sửa thông tin khách hàng');
  }

  ngOnInit(): void {
    this.editCustomerForm = new FormGroup({
      // tslint:disable-next-line:max-line-length
      name: new FormControl('', [Validators.pattern('^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\s?]+$'), Validators.required]),
      dateOfBirth: new FormControl('', [Validators.pattern('^[a-zA-Z\\s?]+$'), this.check16Age]),
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
    const id = Number(this.activatedRoute.snapshot.params.id);
    this.customerService.getCustomerByID(id).subscribe(value => {
        this.customerEdit = value;
        console.log(value);
        this.editCustomerForm.patchValue(this.customerEdit);
        this.editCustomerForm.patchValue({district: value.commune.district});
        this.editCustomerForm.patchValue({province: value.commune.district.province});
        console.log(this.editCustomerForm);
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
    const customerDTO = this.editCustomerForm.value;
    customerDTO.id = this.customerEdit.id;
    this.customerService.updateCustomer(this.customerEdit.id, this.editCustomerForm.value).subscribe(res => {
      this.toast.success('Chỉnh sửa thông tin khách hàng thành công!');
      this.route.navigateByUrl('/listCustomer');
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

  compareCommuneId(item1, item2) {
    return item1 && item2 && item1.id === item2.id;
  }

}

