import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ProductService} from '../../../product/service/product.service';
import {ToastrService} from 'ngx-toastr';
import {ProductCategory} from '../../../product/model/ProductCategory';
import {Product} from '../../../product/model/Product';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-payment-detail',
  templateUrl: './payment-detail.component.html',
  styleUrls: ['./payment-detail.component.css']
})
export class PaymentDetailComponent implements OnInit, OnChanges {
  product: Product = null;
  productUnit = '';
  productPrice = 0;
  orderProduct: Product = null;
  productList: Product[];
  orderProductList = Array<Product>();
  totalPayment: number;
  checkExist = false;
  count = 1;
  idDelete: number;

  imageSrc = 'https://nairobigames.center/wp-content/uploads/2019/10/Nairobi-GDC-FINAL-LOGO-TRANS.png';

  productCategoryList: ProductCategory[];

  // productForm: FormGroup = new FormGroup({
  //   id: new FormControl(0),
  //   nameProduct: new FormControl(''),
  //   quantity: new FormControl(0),
  //   unit: new FormControl(''),
  //   prices: new FormControl(0),
  //   imageUrl: new FormControl(''),
  //   productCategory: new FormGroup({
  //     id: new FormControl(0, [Validators.required]),
  //     name: new FormControl('', [Validators.required])
  //   }),
  //   deleteStatus: new FormControl(1),
  //   checked: new FormControl(true)
  // });
  quantity = 0;


  constructor(private productService: ProductService, private toast: ToastrService) {
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
      console.log(this.product);
      this.orderProduct = this.product;
      console.log(this.orderProduct);
      this.orderProduct.quantity = this.quantity;
      console.log(this.quantity);
      console.log(this.quantity + 'okeee');
      for (let i = 0; i - 1 < this.orderProductList.length - 1; i++) {
        if (this.orderProductList[i].id === this.orderProduct.id) {
          console.log(this.count + ' lần trùng');
          this.count++;
          this.orderProductList[i].quantity += this.quantity;
          console.log(this.orderProduct.quantity);
          console.log(this.orderProductList[i].quantity);
          console.log('đã cộng thêm');
          this.checkExist = true;
        }
      }
      console.log('check');
      console.log(this.checkExist);
      if (!this.checkExist) {
        this.orderProductList.push(this.orderProduct);
        console.log('đã push vào');
      }
      this.checkExist = false;
      console.log('set');
      console.log(this.checkExist);
      console.log(this.orderProductList);
      console.log('OKE');
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
  }

  getIdDelete(id: number) {
    this.idDelete = id;
  }
}
