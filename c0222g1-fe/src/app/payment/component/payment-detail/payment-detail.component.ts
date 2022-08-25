import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ProductService} from '../../../product/service/product.service';
import {ToastrService} from 'ngx-toastr';
import {ProductCategory} from '../../../product/model/ProductCategory';
import {Product} from '../../../product/model/Product';
import {PaymentDetailService} from '../../service/payment-detail.service';
import {Router} from '@angular/router';
import {Record} from '../../model/record';
import {PaymentService} from '../../service/payment.service';
import {PaymentDetail} from '../../model/payment-detail';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-payment-detail',
  templateUrl: './payment-detail.component.html',
  styleUrls: ['./payment-detail.component.css']
})
export class PaymentDetailComponent implements OnInit, OnChanges {
  product: Product = null;
  record: Record = null;
  productUnit = '';
  productPrice = 0;
  orderProduct: Product = null;
  productList: Product[];
  orderProductList = Array<Product>();
  totalPayment: number;
  totalOfOrder = 0;
  checkExist = false;
  deleteProduct: any;
  quantity = 0;
  selectId = 0;
  categorySelectId = 0;

  imageSrc = '../../../../assets/img/img-login/banner-login.png';

  productCategoryList: ProductCategory[];

  constructor(private productService: ProductService,
              private toast: ToastrService,
              private paymentDetailService: PaymentDetailService,
              private paymentService: PaymentService,
              private route: Router,
              private title: Title) {
    this.title.setTitle('Yêu cầu dịch vụ');
    this.getProductCategoryList();
    this.getAllProductForOrder();
  }

  getProductCategoryList() {
    this.productService.findAllProductCategory().subscribe(value => {
      this.productCategoryList = value;
      for (let i = 0; i - 1 < this.productCategoryList.length - 1; i++) {
        if (this.productCategoryList[i].name === 'Dịch vụ khác') {
          this.categorySelectId = this.productCategoryList[i].id;
          this.getProductOptionList(this.categorySelectId);
        }
      }

    });
  }

  getAllProductForOrder() {
    this.productService.findAllProductForOrder().subscribe((value: any) => {
      if (value != null) {
        this.productList = value;
        for (let i = 0; i - 1 < this.productList.length - 1; i++) {
          if (this.productList[i].nameProduct === 'Giờ chơi') {
            this.selectId = this.productList[i].id;
            this.getProductById(this.selectId);
          }
        }
      }
    }, error => {
      console.log('ERROR AT GET LIST PRODUCT BY CATEGORY ID');
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  updateOrderList() {
    if (this.product !== null) {
      if (this.quantity > 0) {
        if (this.quantity > this.product.quantity) {
          this.toast.error('Hiện chỉ còn ' + this.product.quantity + ' sản phẩm này trong kho, ' + 'vui lòng chọn lại.');
        } else {
          this.orderProduct = this.product;
          this.orderProduct.quantity = this.quantity;
          this.totalOfOrder += this.orderProduct.prices * this.quantity;
          for (let i = 0; i - 1 < this.orderProductList.length - 1; i++) {
            if (this.orderProductList[i].id === this.orderProduct.id) {
              this.orderProductList[i].quantity += this.quantity;
              this.checkExist = true;
            }
          }
          if (!this.checkExist) {
            this.orderProductList.push(this.orderProduct);
          }
          this.checkExist = false;
          this.resetValue();
          this.getAllProductForOrder();
          this.getProductCategoryList();
        }
      } else {
        this.toast.error('Cần nhập số dương.');
      }
    } else {
      this.toast.error('Vui lòng chọn sản phẩm.');
    }
  }


  getProductById(productId: any) {
    this.resetValue();
    if (productId === null) {
      this.toast.error('Sản phẩm ngừng kinh doanh.');
    } else {
      this.productService.loadInfoProductById(Number(productId)).subscribe(result => {
        this.product = result;
        this.productUnit = this.product.unit;
        this.productPrice = this.product.prices;
        this.imageSrc = this.product.imageUrl;
      });
    }
  }

  getProductOptionList(value: any) {
    this.resetValue();
    if (value.toString() === 'null') {
      this.getAllProductForOrder();
    } else {
      this.productService.findProductListByCategoryId(Number(value)).subscribe(list => {
        this.productList = list;
      });
    }
  }

  ngOnInit(): void {
    this.getRecordById();
  }

  getRecordById() {
    if (sessionStorage.getItem('token')) {
      const id = Number(sessionStorage.getItem('recordId'));
      this.paymentDetailService.loadInfoRecordById(id).subscribe(value => {
        this.record = value;
      });
    }
  }

  resetValue() {
    this.productUnit = '';
    this.productPrice = 0;
    this.quantity = 0;
    this.totalPayment = 0;
    this.imageSrc = '../../../../assets/img/img-login/banner-login.png';
  }

  showTotalPayment(value: any) {
    if (this.quantity >= 0) {
      this.totalPayment = value * this.productPrice;
    } else {
      this.totalPayment = 0;
    }
  }

  undoChooseProduct() {
    for (let i = 0; i - 1 < this.orderProductList.length - 1; i++) {
      if (this.orderProductList[i].id === this.deleteProduct.id) {
        this.totalOfOrder -= this.deleteProduct.prices * this.deleteProduct.quantity;
        this.orderProductList.splice(i, 1);
      }
    }
    this.toast.success('Hoàn tác thành công.');
  }

  getProductToDelete(value: Product) {
    this.deleteProduct = value;
    if (this.deleteProduct !== null) {
      // tslint:disable-next-line:max-line-length
      document.getElementById('nameDelete').innerHTML = 'Bạn có muốn hoàn tác dịch vụ ' + '<span style="font-weight: bold; color: #0d6efd">' + value.nameProduct + '</span> ?';
    } else {
      console.log('Error at get product to delete!');
    }
  }

  orderToDatabase() {
    this.paymentService.savePayment(this.record).subscribe(value => {
      this.toast.success('Yêu cầu thành công.');
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.orderProductList.length; i++) {
        const paymentDetail: PaymentDetail = {
          payment: value,
          product: this.orderProductList[i],
          amount: this.orderProductList[i].quantity,
        };
        this.paymentDetailService.savePaymentDetail(paymentDetail).subscribe(value1 => {
          if (i === this.orderProductList.length - 1) {
            this.route.navigateByUrl('/payment/' + value.record.customer.id);
          }
        });
      }
    });
  }
}
