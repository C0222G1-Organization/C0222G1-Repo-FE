import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './component/login/login.component';
import {ForbiddenComponent} from './component/forbidden/forbidden.component';
import {LogoutComponent} from './component/logout/logout.component';
import {UnauthorizedComponent} from './component/unauthorized/unauthorized.component';


const routes: Routes = [
  {path: 'sign-in' , component: LoginComponent},
  {path: '403' , component: ForbiddenComponent},
  {path: '401' , component: UnauthorizedComponent},
  {path: 'sign-out' , component: LogoutComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
