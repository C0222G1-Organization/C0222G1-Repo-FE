/*
* Created by: LuanND
* Date created: 09/08/2022
* function : render excute load plugin paypal fill block
* @param id : the place will be render load plugin paypal
* @param currency: unit currency payment
* @param value: total money need payment
* @param onApprove: it'll be excute when payment has approved
* */
import { Component, OnInit } from '@angular/core';
// import {render} from 'creditcardpayments/creditCardPayments'

@Component({
  selector: 'app-display-payment',
  templateUrl: './display-payment.component.html',
  styleUrls: ['./display-payment.component.css']
})
export class DisplayPaymentComponent implements OnInit {

  constructor() {
    // render(
    //   {
    //     id: "#myPaypal",
    //     currency: "USD",
    //     value: "100.00",
    //     onApprove: (details) => {
    //       console.log(details);
    //       alert("Transaction Successfully!");
    //     }
    //   }
    // )
  }

  ngOnInit(): void {
  }

}
