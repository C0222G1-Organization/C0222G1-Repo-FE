import {Component, OnInit} from '@angular/core';
import {Customer} from '../../model/customer';
import {ActivatedRoute, Router} from '@angular/router';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomerService} from '../../service/customer.service';
import {CustomValidators} from './custom-validators';
import {Province} from '../../model/province';
import {District} from '../../model/district';
import {Commune} from '../../model/commune';
import {CreateCustomerService} from '../../service/create-customer.service';

@Component({
  selector: 'app-customer-information',
  templateUrl: './customer-information.component.html',
  styleUrls: ['./customer-information.component.css']
})
export class CustomerInformationComponent implements OnInit {

  customer: Customer;
  content = '';
  inputType: string;
  confirmInputType: string;
  typePassword = false;
  typeConfirmPassword = false;
  hour: any;
  minutes: any;

  provinceList: Province[];
  districtList: District[];
  communeList: Commune[];

  constructor(private activatedRoute: ActivatedRoute,
              private route: Router,
              private customerService: CustomerService,
              private createCustomerService: CreateCustomerService) {
  }

  /**
   * Create by: DuyNT
   * Date Create: 11/08/2022
   * function: load customer info into Form
   */

  customerForm: FormGroup = new FormGroup({
    id: new FormControl(0),
    // tslint:disable-next-line:max-line-length
    name: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\s?]+$')]),
    // phoneNumber: new FormControl('', [Validators.required, Validators.pattern('^(091|090|\\(\\+84\\)90|\\(\\+84\\)91)\\d{7}$')]),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern('^\\d{10,12}$')]),
    dateOfBirth: new FormControl('', [Validators.required, Validators.pattern('^\\d{4}-\\d{2}-\\d{2}$'), this.check16Age]),
    email: new FormControl('', [Validators.required, Validators.email]),
    remainingTime: new FormControl(0, [Validators.required, Validators.pattern('^\\d{9}$')]),
    commune: new FormGroup({
      id: new FormControl(0, [Validators.required]),
      name: new FormControl('', [Validators.required])
    }),
    user: new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    }),
    deleteStatus: new FormControl(1),
    activeStatus: new FormControl(1),
    confirmPassword: new FormControl('', [Validators.required])
  }, [CustomValidators.mustMatch('password', 'confirmPassword')]);

  ngOnInit(): void {
    this.loadInfoCustomer();
  }

  /**
   * Create by: DuyNT
   * Date Create: 11/08/2022
   * function: load customer form DB
   */
  loadInfoCustomer() {
    // this.customer = this.customerForm.value;
    // console.log(this.customer);
    // const idFromRoute = Number(this.activatedRoute.snapshot.params.id);
    // this.userService.findById(idFromRoute).subscribe(result => {
    //   console.log(result)
    //   if (result === undefined) {
    //     this.route.navigate(['/error']);
    //   }
    //   this.userForm.patchValue(result);
    // });
    // const customerIdFromRoute = Number(this.activatedRoute.snapshot.params.id);
    const customerIdFromRoute = 3;
    this.customerService.findCustomerById(customerIdFromRoute).subscribe(value => {
      console.log(value);
      this.customerForm.patchValue(value);
      this.customer = value;
      // console.log(this.customer);
      this.minutes = this.customer.remainingTime % 60;
      if (this.minutes < 10) {
        this.minutes = '0' + this.minutes;
      }
      this.hour = (this.customer.remainingTime - this.minutes) / 60;
      if (this.hour < 10) {
        this.hour = '0' + this.hour;
      }
      // console.log(this.customer.user.password);
    });
  }


  /**
   * Create by: DuyNT
   * Date Create: 11/08/2022
   * function: save customer after edit
   */
  saveUpdateUser() {
    this.customer = this.customerForm.value;
    console.log(this.customer);
    this.content = '';
    // const updateUser = this.userForm.value;
    // this.userService.saveUser(updateUser).subscribe(value => {
    //   this.route.navigate(['/users/list']);
    // })
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

  getDistrictList($event: Event) {
    // @ts-ignore
    if ($event === '') {
      this.districtList = [];
      this.communeList = [];
    } else {
      this.createCustomerService.getAllDistrict(Number($event)).subscribe(
        value => this.districtList = value);
    }
  }

  getCommuneList($event: Event) {
    // @ts-ignore
    if ($event === '') {
      this.communeList = [];
    } else {
      this.createCustomerService.getAllCommune(Number($event)).subscribe(
        value => this.communeList = value);
    }
  }
}
