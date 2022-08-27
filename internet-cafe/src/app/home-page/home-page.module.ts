import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomePageRoutingModule } from './home-page-routing.module';
import { HomePageComponent} from "./component/home-page.component";
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [HomePageComponent],
  imports: [
    CommonModule,
    HomePageRoutingModule,
    FormsModule
  ]
})
export class HomePageModule { }
