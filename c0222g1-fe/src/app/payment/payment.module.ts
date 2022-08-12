import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentRoutingModule } from './payment-routing.module';
import {PaymentService} from './service/payment.service';
import { PaymentDetailComponent} from "./component/payment-detail/payment-detail.component";
import {DisplayPaymentComponent} from "./component/display-payment/display-payment.component";

@NgModule({
  declarations: [
    PaymentDetailComponent,
    DisplayPaymentComponent
  ],
  imports: [
    CommonModule,
    PaymentRoutingModule
  ],
  providers: [PaymentService]
})
export class PaymentModule { }
