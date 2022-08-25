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
import {StatisticRoutingModule} from './statistic/statistic-routing.module';
import {ServerErrorComponent} from './common-component/server-error/server-error.component';
import {NotFoundComponent} from './common-component/not-found/not-found.component';
import {ProductRoutingModule} from './product/product-routing.module';
import {AboutUsComponent} from "./common-component/footer/about-us/about-us.component";
import {LinkComponent} from "./common-component/footer/link/link.component";
import {JobsComponent} from "./common-component/footer/jobs/jobs.component";
import {LicenseComponent} from "./common-component/footer/license/license.component";

const routes: Routes = [
  {
    path: '500', component: ServerErrorComponent
  },
  {
    path: 'about-us', component: AboutUsComponent
  },
  {
    path: 'link', component: LinkComponent
  },
  {
    path: 'jobs', component: JobsComponent
  },
  {
    path: 'license', component: LicenseComponent
  },
  {path: '**', component: NotFoundComponent},
  {
    path: 'payment',
    loadChildren: () => import('./payment/payment.module').then(module => module.PaymentModule)
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes),
    AuthenticationRoutingModule,
    ComputerRoutingModule,
    CustomerRoutingModule,
    EmployeeRoutingModule,
    GameRoutingModule,
    NewsRoutingModule,
    PaymentRoutingModule,
    RegistrationRoutingModule,
    StatisticRoutingModule,
    HomePageRoutingModule,
    ProductRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
