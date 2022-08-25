import {Component, OnInit} from '@angular/core';
import {ProductService} from '../../service/product.service';
import {Product} from '../../model/Product';
import {ProductCategory} from '../../model/ProductCategory';
import {ToastrService} from 'ngx-toastr';
import {Title} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  map = new Map<any, any>();

  constructor(private productService: ProductService,
              private toast: ToastrService,
              private titleService: Title, private route: Router) {
  }

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
  role: any;


  formProduct = new FormGroup({
    nameProduct: new FormControl('',
      [Validators.pattern('^[0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\\\s? ]+$'),
        Validators.maxLength(25)])
  });

  /**
   * Create by: TruongTX
   * Date create: 14/08/2022
   * function: check role
   */

  checkRole(): string {
    return localStorage.getItem('roles');
  }

  /**
   * Create by: TruongTX
   * Date create: 14/08/2022
   * function: show list product
   */
  ngOnInit(): void {
    this.role = this.checkRole();
    this.titleService.setTitle('Danh sách dịch vụ');
    this.getAllProduct();
    this.getAllProductCategory();
    // if (this.totalElements === 1 ) {
    //   this.productList.length = 0;
    //   this.toast.error('Đã hết sản phẩm trong kho');
    // }
    if (this.totalElements >= this.productList.length) {
      this.productList.length = 0;
    }
  }

  /**
   * Create by: TruongTX
   * Date create: 14/08/2022
   * function: Get all product
   */
  getAllProduct() {
    this.productService.findAllProduct(this.name, this.page).subscribe((value: any) => {
      if (value != null) {
        this.productList = value.content;
        this.totalElements = value.totalElements;
        this.pages = value.totalPages;
      }
    }, error => {
      this.route.navigateByUrl('/500');
    });
  }

  /**
   * Create by: TruongTX
   * Date create: 14/08/2022
   * function: Get all product category
   */
  getAllProductCategory() {
    this.productService.findAllProductCategory().subscribe(value => {
      this.productCategoryList = value;
    });
  }

  /**
   * Create by: TruongTX
   * Date create: 14/08/2022
   * function: Search product
   */
  search() {
    // this.name = this.formProduct.value;
    this.name = this.name.trim();
    if (this.page !== 0) {
      this.page = 0;
    }
    if (this.name === '') {
      this.toast.info('Bạn cần nhập giá trị vào ô tìm kiếm');
      this.ngOnInit();
    }
    this.productService.findAllProduct(this.name, this.page).subscribe((value: any) => {
      if (value !== null && this.name !== '' && this.formProduct.valid) {
        this.productList = value.content;
        this.totalElements = value.totalElements;
        this.page = 0;
        this.toast.success('Bạn đã tìm thấy ' + this.totalElements + ' kết quả');
      }
      if (value === null) {
        this.toast.error('Không tìm thấy kết quả');
        this.productList.length = 0;
      }
    }, error => {
    }, () => {

    });

  }

  /**
   * Create by: TruongTX
   * Date create: 14/08/2022
   * function: Pagination
   */
  getPage(event: number) {
    this.page = event - 1;
    this.getAllProduct();
  }

  /**
   * Create by: TruongTX
   * Date create: 14/08/2022
   * function: Get the value to delete product
   */
  valueOfDelete(nameProduct: string, id: number) {
    this.nameProduct = nameProduct;
    this.id = id;
  }

  /**
   * Create by: TruongTX
   * Date create: 14/08/2022
   * function: Delete product
   */
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


  getSelectedProducts() {
    this.selectedNameProducts = this.productList.filter(product => product.checked);
    console.log(this.selectedNameProducts);
  }

  checkProduct(id: number) {
    for (const product of this.productList) {
      if (product.id === id) {
        product.checked = product.checked !== true;
        break;
      }
    }
    // Dùng để gửi tên các sản phẩm ứng với id
    this.getSelectedProducts();

  }

  isAllCheckBoxChecked() {
    this.productList.forEach(value => {
      if (value.checked === true) {
        this.map.set(value.id, value);
      } else {
        this.map.delete(value.id);
      }

    });
    return this.productList.every(e => e.checked);
  }

  // chọn tất cả record
  checkAllCheckBox(event: any) {
    this.productList.forEach(x => x.checked = event.target.checked);
    this.getSelectedProducts();
  }

  // Xóa tất cả
  deleteProductList() {
    this.selectedIdProducts = this.productList.filter(product => product.checked).map(p => p.id);
    for (const product of this.selectedIdProducts) {
      this.id = product;
      this.productService.delete(this.id).subscribe(value => {
        if (this.productList.length === this.selectedIdProducts.length) {
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

  bestSeller() {
    this.productService.showListBestSeller(this.name, this.page).subscribe((value: any) => {
      if (value != null) {
        this.productList = value.content;
        this.totalElements = value.totalElements;
      }
    }, error => {
      this.route.navigateByUrl('/500');
    });
  }
}
