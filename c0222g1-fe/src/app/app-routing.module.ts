import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PaymentRoutingModule} from "./payment/payment-routing.module";
import {AuthenticationRoutingModule} from "./authentication/authentication-routing.module";
import {ComputerRoutingModule} from "./computer/computer-routing.module";
import {CustomerRoutingModule} from "./customer/customer-routing.module";
import {EmployeeRoutingModule} from "./employee/employee-routing.module";
import {GameRoutingModule} from "./game/game-routing.module";
import {NewsRoutingModule} from "./news/news-routing.module";
import {HeaderComponent} from "./common-component/header/header.component";
import {IndexRoutingModule} from "./index/index-routing.module";

const routes: Routes = [
  {
    path: '',
    component: HeaderComponent
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
    PaymentRoutingModule,
    IndexRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
