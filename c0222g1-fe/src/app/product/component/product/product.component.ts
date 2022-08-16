import {Component, OnInit} from '@angular/core';
import {ProductService} from '../../service/product.service';
import {Product} from '../../model/Product';
import {ProductCategory} from '../../model/ProductCategory';
import {ToastrService} from 'ngx-toastr';
import {Title} from '@angular/platform-browser';
import {Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import {CurrencyPipe} from "@angular/common";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  nameProduct = '';
  name = '';
  id: number;
  productList: Product[] = [];
  checked: boolean;
  productCategoryList: ProductCategory[];
  page = 0;
  totalElements: number;
  pages: any;
  selectedIdProducts: any[] = [];
  selectedNameProducts: any[] = [];
  isSelected = false;
  role: any;
  constructor(private productService: ProductService,
              private toast: ToastrService,
              private titleService: Title) {
  }
  checkRole(): string {
    return  sessionStorage.getItem('roles');
  }

  ngOnInit(): void {
    this.role = this.checkRole();
    this.titleService.setTitle('Danh sách dịch vụ');
    this.getAllProduct();
    this.getAllProductCategory();
    if (this.totalElements === 1) {
      this.productList.length = 0;
      this.toast.error('Đã hết sản phẩm trong kho');
    }
    if (this.totalElements >= this.productList.length) {
      this.productList.length = 0;
    }
  }

  getAllProduct() {
    this.productService.findAllProduct(this.name, this.page).subscribe((value: any) => {
      if (value != null) {
        this.productList = value.content;
        this.totalElements = value.totalElements;
        this.pages = value.totalPages;
      }
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
      if (value !== null) {
        this.productList = value.content;
        this.totalElements = value.totalElements;
        this.page = 0;
      }
      if (value === null) {
        this.toast.error('Không tìm thấy kết quả');
        this.productList.length = 0;
      }
    }, error => {
    }, () => {
    });
  }

  getPage(event: number
  ) {
    this.page = event - 1;
    this.getAllProduct();
  }

  delete() {
    this.productService.delete(this.id).subscribe(value => {
      if (this.productList.length === 1) {
        if (this.page === 0) {
          this.page = 0;
        } else {
          this.page -= 1;
        }
      }
      console.log(this.totalElements);
    }, error => {

    }, () => {
      this.toast.success('Xóa dịch vụ thành công');
      this.ngOnInit();
    });
  }

  valueOfDelete(nameProduct: string, id: number) {
    this.nameProduct = nameProduct;
    this.id = id;
  }

  isAllCheckBoxChecked() {
    console.log(14);
    if (this.productList.length !== 0) {
      return this.productList.every(p => p.checked);
    }
    console.log(512);
  }

  checkAllCheckBox(event: any) {
    console.log(5678);
    this.productList.forEach(x => x.checked = event.target.checked);
  }

  valueOfDeleteAll(nameDeleteAll: string, idDeleteAll: number) {

  }

  deleteProductList() {
    this.selectedIdProducts = this.productList.filter(product => product.checked).map(p => p.id);
    console.log(this.selectedIdProducts);
    console.log(this.selectedNameProducts);
    for (const product of this.selectedIdProducts) {
      this.id = product;
      this.productService.delete(this.id).subscribe(value => {

        if (this.productList.length === 1) {
          if (this.page === 0) {
            this.page = 0;
          } else {
            this.page -= 1;
          }
        }
        if (this.productList.length > 1) {
          if (this.page === 0) {
            this.page = 0;
          } else {
            this.page -= 1;
          }
        }
      }, error => {
      }, () => {
        console.log(this.productList.length);
        this.ngOnInit();
      });
    }
    if (this.selectedIdProducts.length > 0) {
      this.toast.success('Xóa sản phẩm thành công');
    }
  }
}
