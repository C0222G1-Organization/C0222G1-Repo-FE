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

  name = '';

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
    this.productService.findAllProduct(this.name, this.page).subscribe((value: any) => {
      this.productList = value.content;
      this.totalElements = value.totalElements;
      // this.productList.sort((a, b) => a.quantity - b.quantity);
      console.log(this.name);
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
    this.productService.findAllProduct(this.name, this.page).subscribe(value => {
      this.productList = value;
      this.page = 0;
    });
  }

  getPage(event: number) {
    this.page = event - 1;
    console.log(event);
    this.getAllProduct();
  }
}
