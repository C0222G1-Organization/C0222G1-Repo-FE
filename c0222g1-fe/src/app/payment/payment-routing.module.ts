import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DisplayPaymentComponent} from "./component/display-payment/display-payment.component";


const routes: Routes = [
  {
    path: '', pathMatch: 'full', redirectTo: 'display'
  },
  {
    path: 'display', component: DisplayPaymentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule {
}
