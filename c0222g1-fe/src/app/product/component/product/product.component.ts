import {Component, OnInit} from '@angular/core';
import {ProductService} from '../../service/product.service';
import {Product} from '../../model/Product';
import {ProductCategory} from '../../model/ProductCategory';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  nameProduct = '';

  productList: Product[];

  productCategoryList: ProductCategory[];
  page = 0;
  totalElements: string | number;

  constructor(private productService: ProductService) {
  }

  ngOnInit(): void {
    this.getAllProduct();
    this.getAllProductCategory();
  }

  getAllProduct() {
    this.productService.findAllProduct(this.nameProduct, this.page).subscribe((value: any) => {
      this.productList = value.content;
      this.totalElements = value.totalElements;
      // this.productList.sort((a, b) => a.quantity - b.quantity);
      console.log(value.totalElements);
      console.log(value);
    }, error => {
    });
  }

  getAllProductCategory() {
    this.productService.findAllProductCategory().subscribe(value => {
      this.productCategoryList = value;
    });
  }

  search() {
    if (this.page !== 0) {
      this.page = 0;
    }

    this.productService.findAllProduct(this.nameProduct, this.page).subscribe((value: any) => {
      this.productList = value.content;
      this.totalElements = value.totalElements;
      this.page = 0;
      console.log(this.nameProduct);
      console.log(value);
    });
  }

  getPage(event: number) {
    this.page = event - 1;
    this.getAllProduct();
  }
}
