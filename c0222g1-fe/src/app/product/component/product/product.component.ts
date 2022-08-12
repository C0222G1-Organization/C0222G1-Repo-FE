import {Component, OnInit} from '@angular/core';
import {ProductService} from '../../service/product.service';
import {Product} from '../../model/Product';
import {ProductCategory} from '../../model/ProductCategory';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  nameProduct = '';
  name = '';
  id: number;
  productList: Product[];

  productCategoryList: ProductCategory[];
  page = 0;
  totalElements: string | number;

  constructor(private productService: ProductService, private toast: ToastrService) {
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

    this.productService.findAllProduct(this.name, this.page).subscribe((value: any) => {
      this.productList = value.content;
      this.totalElements = value.totalElements;
      this.page = 0;
      console.log(this.name);
      console.log(value);
    }, error => {
      this.toast.error('Không tìm thấy kết quả', 'Tìm kiếm dịch vụ');
      this.productList.length = 0;
    });
  }

  getPage(event: number) {
    this.page = event - 1;
    this.getAllProduct();
  }

  delete() {
    this.productService.delete(this.id).subscribe(value => {
      console.log(this.id);

    }, error => {

    }, () => {
      this.ngOnInit();
    });
  }

  valueOfDelete(nameProduct: string, id: number) {
    this.nameProduct = nameProduct;
    this.id = id;
  }

  isAllCheckBoxChecked() {
    return this.productList.every(p => p.checked);
  }

  checkAllCheckBox(event: any) {
    this.productList.forEach(x => x.checked = event.target.checked);
  }

  deleteProductList() {
    const selectedProducts = this.productList.filter(product => product.checked).map(p => p.id);

    for (const product of selectedProducts) {
      this.id = product;
      if (selectedProducts.length > 0) {
        this.productService.delete(this.id).subscribe(value => {
          console.log(selectedProducts.length);
        }, error => {
          if (this.page !== 0 && selectedProducts.length !== 0) {
            this.page = this.page - 1;
          }
        }, () => {
          this.getAllProduct();
        });
      }
    }

    console.log(this.page);
    console.log(selectedProducts.length);
    // if (this.page !== 0 && selectedProducts.length === 0) {
    //   this.page = this.page - 1;
    //
    // }
  }
}

