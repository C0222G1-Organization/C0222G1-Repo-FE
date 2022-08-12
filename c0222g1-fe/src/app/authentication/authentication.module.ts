import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginComponent } from './component/login/login.component';
import {ReactiveFormsModule} from '@angular/forms';
import { LogoutComponent } from './component/logout/logout.component';


@NgModule({
  declarations: [LoginComponent, LogoutComponent],
    imports: [
        CommonModule,
        AuthenticationRoutingModule,
        ReactiveFormsModule
    ]
})
export class AuthenticationModule { }
