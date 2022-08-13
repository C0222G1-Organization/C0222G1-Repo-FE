import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PaymentRoutingModule} from './payment/payment-routing.module';
import {AuthenticationRoutingModule} from './authentication/authentication-routing.module';
import {ComputerRoutingModule} from './computer/computer-routing.module';
import {CustomerRoutingModule} from './customer/customer-routing.module';
import {EmployeeRoutingModule} from './employee/employee-routing.module';
import {GameRoutingModule} from './game/game-routing.module';
import {NewsRoutingModule} from './news/news-routing.module';
import {RegistrationRoutingModule} from './registration/registration-routing.module';
import {HomePageRoutingModule} from './home-page/home-page-routing.module';
import {HomePageComponent} from './home-page/component/home-page.component';
import {StatisticRoutingModule} from './statistic/statistic-routing.module';

const routes: Routes = [];

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
    RegistrationRoutingModule,
    StatisticRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
