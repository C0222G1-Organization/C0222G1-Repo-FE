import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DisplayPaymentComponent} from './component/display-payment/display-payment.component';
import {PaymentDetailComponent} from './component/payment-detail/payment-detail.component';
import {AuthGuardEmployeeAdminService} from '../authentication/service/auth-guard-employee-admin.service';


const routes: Routes = [
  {
    path: 'payment', pathMatch: 'full', redirectTo: 'display'
  },
  {
    path: 'display', component: DisplayPaymentComponent,
  canActivate: [AuthGuardEmployeeAdminService]
  },
  {
    path: 'display/:paymentId', component: DisplayPaymentComponent
  },
  {
    path: 'order-service', component: PaymentDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule {
}
