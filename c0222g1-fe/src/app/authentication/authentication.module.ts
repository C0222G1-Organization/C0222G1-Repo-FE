import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginComponent } from './component/login/login.component';
import {ReactiveFormsModule} from '@angular/forms';
import { LogoutComponent } from './component/logout/logout.component';
import { ForbiddenComponent } from './component/forbidden/forbidden.component';


@NgModule({
  declarations: [LoginComponent, LogoutComponent, ForbiddenComponent],
    imports: [
        CommonModule,
        AuthenticationRoutingModule,
        ReactiveFormsModule
    ]
})
export class AuthenticationModule { }
