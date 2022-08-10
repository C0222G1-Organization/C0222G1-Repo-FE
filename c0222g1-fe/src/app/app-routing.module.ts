import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {IndexComponent} from './common-component/index/index.component';
import {PaymentRoutingModule} from "./payment/payment-routing.module";
import {AuthenticationRoutingModule} from "./authentication/authentication-routing.module";
import {ComputerRoutingModule} from "./computer/computer-routing.module";
import {CustomerRoutingModule} from "./customer/customer-routing.module";
import {EmployeeRoutingModule} from "./employee/employee-routing.module";
import {GameRoutingModule} from "./game/game-routing.module";
import {NewsRoutingModule} from "./news/news-routing.module";

const routes: Routes = [
  {
    path: '',
    component: IndexComponent
  }];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes),
    PaymentRoutingModule,
    AuthenticationRoutingModule,
    ComputerRoutingModule,
    CustomerRoutingModule,
    EmployeeRoutingModule,
    GameRoutingModule,
    NewsRoutingModule,
    PaymentRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
