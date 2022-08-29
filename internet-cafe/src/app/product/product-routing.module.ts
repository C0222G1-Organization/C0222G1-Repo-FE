import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ProductComponent} from './component/product/product.component';

const routes: Routes = [

  {path: 'products', component: ProductComponent},
  // Phải là role 'ADMIN' mới được truy cập vào TruongTX

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
