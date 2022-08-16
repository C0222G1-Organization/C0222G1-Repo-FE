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
    nameProduct: new FormControl('', Validators.pattern('^[\-0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\\\s?]+$'))
  });

  checkRole(): string {
    return sessionStorage.getItem('roles');
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
      this.route.navigateByUrl('/500');
    });
  }

  getAllProductCategory() {
    this.productService.findAllProductCategory().subscribe(value => {
      this.productCategoryList = value;
    });
  }

  search() {
    this.name = this.name.trim();
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

  getPage(event: number) {
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
    this.getSelectedProducts();
  }

  isAllCheckBoxChecked() {
    this.productList.forEach(value => {
      if (value.checked === true) {
        this.map.set(value.id, value);
      } else {
        this.map.delete(value.id);
      }
      console.log(value);
    });
    return this.productList.every(e => e.checked);
  }

  checkAllCheckBox(event: any) {
    this.productList.forEach(x => x.checked = event.target.checked);
    this.getSelectedProducts();
  }

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
}
