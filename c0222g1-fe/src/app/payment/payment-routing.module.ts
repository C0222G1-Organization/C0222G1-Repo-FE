import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DisplayPaymentComponent} from './component/display-payment/display-payment.component';
import {PaymentDetailComponent} from './component/payment-detail/payment-detail.component';


const routes: Routes = [
  {
    path: 'payment', pathMatch: 'full', redirectTo: 'display'
  },
  {
    path: 'display', component: DisplayPaymentComponent
    // employee, admin
  },
  {
    path: 'display/:paymentId', component: DisplayPaymentComponent
    // employee, admin, customer
  },
  {
    path: 'order-service', component: PaymentDetailComponent
    // customer
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule {
}
