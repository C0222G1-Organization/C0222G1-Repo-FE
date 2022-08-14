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
  productList: Product[] = [];
  checked: boolean;
  productCategoryList: ProductCategory[];
  page = 0;
  totalElements: number;
  pages: any;
  selectedProducts: any[] = [];

  constructor(private productService: ProductService, private toast: ToastrService) {
  }

  ngOnInit(): void {
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
    if (this.productList.length !== 0) {
      return this.productList.every(p => p.checked);
    }
  }

  checkAllCheckBox(event: any) {
    this.productList.forEach(x => x.checked = event.target.checked);
  }

  deleteProductList() {
    this.selectedProducts = this.productList.filter(product => product.checked).map(p => p.id);

    for (const product of this.selectedProducts) {
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
    if (this.selectedProducts.length > 0) {
      this.toast.success('Xóa dịch vụ thành công');
    }
  }
}
