import {Component, OnInit} from '@angular/core';
import {Customer} from '../../model/customer';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CustomerService} from '../../service/customer.service';

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.css']
})
export class CreateCustomerComponent implements OnInit {
  customerAddNew: Customer;
  customerForm = new FormGroup(
    {
      name: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl(''),
      dayOfBirth: new FormControl('', [Validators.required]),
      email: new FormControl(''),
      remainingTime: new FormControl(0),
      commune: new FormGroup({
        id: new FormControl(0, [Validators.required]),
        name: new FormControl('', [Validators.required]),
        district: new FormGroup(
          {
            id: new FormControl(0),
            name: new FormControl(''),
            province: new FormGroup(
              {
                id: new FormControl(0),
                name: new FormControl('')
              }
            )
          }
        )
      }),
      user: new FormGroup({
        userName: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required])
      }),
      deleteStatus: new FormControl(1),
      activeStatus: new FormControl(1)
    });

  constructor(private activatedRoute: ActivatedRoute,
              private route: Router,
              private customerService: CustomerService) {
  }

  ngOnInit(): void {
  }

  changeProvince($event: Event) {

  }
}
