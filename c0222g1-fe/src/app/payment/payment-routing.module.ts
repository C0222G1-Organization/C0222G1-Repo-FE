import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DisplayPaymentComponent} from './display-payment/display-payment.component';
import {PaymentSuccessComponent} from './payment-success/payment-success.component';
import {PaymentFailComponent} from './payment-fail/payment-fail.component';


const routes: Routes = [
  {
    path: 'payment', pathMatch: 'full', redirectTo: 'display'
  },
  {
    path: 'display', component: DisplayPaymentComponent
  },
  {
    path: 'success', component: PaymentSuccessComponent
  },
  {
    path: 'fail', component: PaymentFailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule {
}
