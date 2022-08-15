import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ProductService} from '../../../product/service/product.service';
import {ToastrService} from 'ngx-toastr';
import {ProductCategory} from '../../../product/model/ProductCategory';
import {Product} from '../../../product/model/Product';
import {PaymentDetailService} from '../../service/payment-detail.service';
import {Router} from '@angular/router';
import {Record} from '../../model/record';
import {Payment} from '../../model/payment';
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
  paymentAfterOrder: Payment;
  productUnit = '';
  productPrice = 0;
  orderProduct: Product = null;
  productList: Product[];
  orderProductList = Array<Product>();
  totalPayment: number;
  checkExist = false;
  quantity = 0;
  count = 1;
  idDelete: number;

  imageSrc = 'https://nairobigames.center/wp-content/uploads/2019/10/Nairobi-GDC-FINAL-LOGO-TRANS.png';

  productCategoryList: ProductCategory[];

  constructor(private productService: ProductService,
              private toast: ToastrService,
              private paymentDetailService: PaymentDetailService,
              private paymentService: PaymentService,
              private route: Router,
              private title: Title) {
    this.title.setTitle('YÊU CẦU DỊCH VỤ');
    this.getProductCategoryList();
    this.getAllProductForOrder();
  }

  getProductCategoryList() {
    this.productService.findAllProductCategory().subscribe(value => {
      this.productCategoryList = value;
    });
  }

  getAllProductForOrder() {
    this.productService.findAllProductForOrder().subscribe((value: any) => {
      if (value != null) {
        this.productList = value;
        console.log(value);
      }
    }, error => {
      console.log('ERROR AT GET LIST PRODUCT BY CATEGORY ID');
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  updateOrderList() {
    if (this.quantity > 0) {
      this.orderProduct = this.product;
      this.orderProduct.quantity = this.quantity;
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
    }
  }


  getProductById(productId: any) {
    this.resetValue();
    if (productId === null) {
      this.product = null;
    } else {
      this.productService.loadInfoProductById(Number(productId)).subscribe(result => {
        this.product = result;
        this.productUnit = this.product.unit;
        this.productPrice = this.product.prices;
        this.imageSrc = this.product.imageUrl;
        console.log(this.imageSrc);
      });
    }
  }

  getProductOptionList(value: any) {
    this.resetValue();
    console.log(value);
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
    if (!sessionStorage.getItem('token')) {
      // const id = Number(sessionStorage.getItem('recordId'));
      const id = 1;
      this.paymentDetailService.loadInfoRecordById(id).subscribe(value => {
        this.record = value;
        console.log(this.record);
      });
    }
  }

  resetValue() {
    this.productUnit = '';
    this.productPrice = 0;
    this.quantity = 0;
    this.totalPayment = 0;
    this.imageSrc = 'https://nairobigames.center/wp-content/uploads/2019/10/Nairobi-GDC-FINAL-LOGO-TRANS.png';
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
      if (this.orderProductList[i].id === this.idDelete) {
        this.orderProductList.splice(i, 1);
      }
    }
    this.toast.success('XÓA THÀNH CÔNG.');
  }

  getIdDelete(id: number) {
    this.idDelete = id;
  }

  orderToDatabase() {
    this.paymentService.savePayment(this.record).subscribe(value => {
      console.log(value);
      this.toast.success('YÊU CẦU THÀNH CÔNG.');

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.orderProductList.length; i++) {
        const paymentDetail: PaymentDetail = {
          payment: value,
          product: this.orderProductList[i],
          amount: this.orderProductList[i].quantity,
        };
        this.paymentDetailService.savePaymentDetail(paymentDetail).subscribe(value1 => {
          if (i === this.orderProductList.length - 1) {
            this.route.navigateByUrl('/display/' + value.id);
          }
        });
      }
    });
  }
}
