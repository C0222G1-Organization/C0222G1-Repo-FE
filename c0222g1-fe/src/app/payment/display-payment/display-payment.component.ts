import { Component, OnInit } from '@angular/core';
import {render} from 'creditcardpayments/creditCardPayments'

@Component({
  selector: 'app-display-payment',
  templateUrl: './display-payment.component.html',
  styleUrls: ['./display-payment.component.css']
})
export class DisplayPaymentComponent implements OnInit {

  constructor() {
    render(
      {
        id: "#myPaypal",
        currency: "USD",
        value: "100.00",
        onApprove: (details) => {
          console.log(details);
          alert("Transaction Successfully!");
        }
      }
    )
  }

  ngOnInit(): void {
  }

}
