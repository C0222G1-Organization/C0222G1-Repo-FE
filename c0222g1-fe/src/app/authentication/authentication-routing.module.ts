import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './component/login/login.component';
import {ForbiddenComponent} from './component/forbidden/forbidden.component';


const routes: Routes = [
  {path: 'login' , component: LoginComponent},
  {path: '403' , component: ForbiddenComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
