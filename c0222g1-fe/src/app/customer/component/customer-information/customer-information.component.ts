import {Component, OnInit} from '@angular/core';
import {CustomerDTO} from '../../model/customerDTO';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomerService} from '../../service/customer.service';
import {CustomValidators} from './custom-validators';

@Component({
  selector: 'app-customer-information',
  templateUrl: './customer-information.component.html',
  styleUrls: ['./customer-information.component.css']
})
export class CustomerInformationComponent implements OnInit {

  customer: CustomerDTO;
  content = '';
  inputType: string;
  confirmInputType: string;
  typePassword = false;
  typeConfirmPassword = false;
  background = '/assets/img/abc.jpg';

  constructor(private activatedRoute: ActivatedRoute,
              private route: Router,
              private customerService: CustomerService) {
  }

  // customerForm: FormGroup = new FormGroup({
  //   id: new FormControl(0),
  //   userName: new FormControl(''),
  //   name: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z]+(([\',. -][a-zA-Z ])?[a-zA-Z]*)*$')]),
  //   // fullName: new FormControl('Nguyen Thien Duy', [Validators.required]),
  //   dateOfBirth: new FormControl('', [Validators.required, Validators.pattern('^\\d{4}-\\d{2}-\\d{2}$')]),
  //   email: new FormControl('', [Validators.required, Validators.email]),
  //   address: new FormControl('', [Validators.required]),
  //   phoneNumber: new FormControl('', [Validators.required, Validators.pattern('^(091|090|\\(\\+84\\)90|\\(\\+84\\)91)\\d{7}$')]),
  //   password: new FormControl('', [Validators.required]),
  //   confirmPassword: new FormControl('', [Validators.required]),
  //   status: new FormControl(1)
  // }, [CustomValidators.mustMatch('password', 'confirmPassword')]);

  customerForm: FormGroup = new FormGroup({
    id: new FormControl(0),
    name: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern('^(091|090|\\(\\+84\\)90|\\(\\+84\\)91)\\d{7}$')]),
    dateOfBirth: new FormControl('', [Validators.required, Validators.pattern('^\\d{4}-\\d{2}-\\d{2}$')]),
    email: new FormControl('', [Validators.required, Validators.email]),
    remainingTime: new FormControl(0, [Validators.required, Validators.pattern('^\\d{9}$')]),
    commune: new FormGroup({
      id: new FormControl(0, [Validators.required]),
      name: new FormControl('', [Validators.required])
    }),
    user: new FormGroup({
      userName: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    }),
    deleteStatus: new FormControl(1),
    activeStatus: new FormControl(1),
  });


  ngOnInit(): void {
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
    const customerIdFromRoute = 1;
    this.customerService.findCustomerById(customerIdFromRoute).subscribe(value => {
      console.log('okee');
      console.log(value);
      this.customer = value;
      this.customer.id = value.id;
      this.customer.name = value.name;
      this.customer.phoneNumber = value.phoneNumber;
      this.customer.dateOfBirth = value.dateOfBirth;
      this.customer.activeStatus = value.activeStatus;
      this.customer.deleteStatus = value.deleteStatus;
      this.customer.remainingTime = value.remainingTime;
      this.customer.user = value.user;
      this.customer.commune = value.commune;
      console.log('HERE');
      console.log(this.customer);
      if (value === undefined) {
        this.route.navigate(['/error']);
      }
      this.customerForm.patchValue(value);
      console.log(this.customerForm.value);
    });
  }

  // getInfoCustomer(){
  //   this.customerService.findCustomerById()
  // }

  saveUser() {
    console.log(this.customerForm.value);
    this.customer = this.customerForm.value;
    this.content = '';
    // const updateUser = this.userForm.value;
    // this.userService.saveUser(updateUser).subscribe(value => {
    //   this.route.navigate(['/users/list']);
    // })
  }

  activeEdit(item: any) {
    this.typePassword = true;
    this.typeConfirmPassword = true;
    console.log(item);
    this.content = item;
    this.setType();
    this.setConfirmType();
  }

  setType() {
    console.log(this.typePassword);
    this.typePassword = !this.typePassword;
    if (this.typePassword === false) {
      this.inputType = 'password';
    } else {
      this.inputType = 'text';
    }
  }

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
