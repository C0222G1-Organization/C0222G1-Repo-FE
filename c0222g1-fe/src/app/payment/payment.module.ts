import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentRoutingModule } from './payment-routing.module';
import {PaymentService} from './service/payment.service';
import { PaymentDetailComponent } from './payment-detail/payment-detail.component';


@NgModule({
  declarations: [PaymentDetailComponent],
  imports: [
    CommonModule,
    PaymentRoutingModule
  ],
  providers: [PaymentService]
})
export class PaymentModule { }
