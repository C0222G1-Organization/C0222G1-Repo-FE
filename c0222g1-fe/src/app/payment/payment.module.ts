import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentRoutingModule } from './payment-routing.module';
import {PaymentService} from './service/payment.service';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { PaymentFailComponent } from './payment-fail/payment-fail.component';
import {DisplayPaymentComponent} from './display-payment/display-payment.component';

@NgModule({
  declarations: [PaymentSuccessComponent, PaymentFailComponent, DisplayPaymentComponent],
  imports: [
    CommonModule,
    PaymentRoutingModule
  ],
  providers: [PaymentService]
})
export class PaymentModule { }
