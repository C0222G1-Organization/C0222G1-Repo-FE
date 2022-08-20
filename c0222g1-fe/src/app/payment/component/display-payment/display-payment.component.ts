import {Component, OnInit} from '@angular/core';
import {render} from 'creditcardpayments/creditCardPayments';
import {PaymentService} from '../../service/payment.service';
import {Payment} from '../../model/payment';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {ReponseBody} from '../../model/reponse-body';
import {ProductService} from '../../../product/service/product.service';
import {CustomerService} from '../../../customer/service/customer.service';

declare var $: any;

@Component({
  selector: 'app-display-payment',
  templateUrl: './display-payment.component.html',
  styleUrls: ['./display-payment.component.css']
})
export class DisplayPaymentComponent implements OnInit {

  constructor(private route: Router,
              private toast: ToastrService,
              private paymentService: PaymentService,
              private productService: ProductService,
              private customerService: CustomerService,
              private activatedRoute: ActivatedRoute,
              private title: Title) {
    this.title.setTitle('THÔNG TIN THANH TOÁN');
  }

  obj: any;
  listPayment: any = [];
  page = 0;
  totalItems: any;
  itemsPerPage = 5;
  totalPages;

  /**
   * Create: LuanND
   * Date: 17/08/2022
   * Description: method payment by paypal
   * @param id: is ID of object payment to create request
   * return none
   */
  totalPay: number;

  ngOnInit(): void {
    const id = Number(this.activatedRoute.snapshot.params.paymentId);
    if (isNaN(id)) {
      this.getAllPayment();
    } else {
      this.paymentService.getById(id).subscribe((value: any) => {
        this.listPayment = [];
        this.listPayment.push(value);
        this.totalItems = value.totalElements;
        this.totalPages = value.totalPages;
        this.calculatorPayment();
      }, error => {
        this.toast.error('Không tìm thấy');
      });
    }
  }

  /**
   * Create: LuanND
   * Date: 17/08/2022
   * Description: get page from API
   * return none
   */
  getAllPayment() {
    this.paymentService.getAllPagePayment(this.page).subscribe((value: any) => {
      this.listPayment = value.content;
      this.totalItems = value.totalElements;
      this.totalPages = value.totalPages;
      this.calculatorPayment();
    }, error => {
      this.route.navigateByUrl('/500');
    });
  }

  /**
   * Create: LuanND
   * Date: 17/08/2022
   * Description: Calculator total pay service of customer
   * return none
   */
  calculatorPayment() {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.listPayment.length; i++) {
      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < this.listPayment[i].paymentDetailList.length; j++) {
        this.listPayment[i].totalPay += this.listPayment[i].paymentDetailList[j].amount *
          this.listPayment[i].paymentDetailList[j].product.prices;
      }
    }
  }

  /**
   * Create: LuanND
   * Date: 17/08/2022
   * Description: Visible button payment by paypal
   * @param id: is block contain button payment by paypal
   * return none
   */
  statePaypal(id: number) {
    const state = $('#payWithPaypal').val;
    if (state) {
      this.paymentWithPaypal(id);
    }
  }

  /**
   * Create: LuanND
   * Date: 17/08/2022
   * Description: Visible button payment by paypal
   * @param id: is block contain button payment by paypal
   * return none
   */
  stateMomo(id: number) {
    const state = $('#payWithMomo').val;
    if (state) {
      this.paymentWithMomo(id);
    }
  }

  /**
   * Create: LuanND
   * Date: 17/08/2022
   * Description: get method payment
   * @param id: is ID of object payment need execution
   * return none
   */
  getPayment(id: number) {
    document.getElementById('body-payment').innerHTML = '<div class="container">\n' +
      '          <div id="paypalMethod">\n' +
      '            <h4 class="text-white">Paypal</h4>\n' +
      // tslint:disable-next-line:max-line-length
      '            <div class="form-group"><div class="form-check form-switch">' +
      '            <input class="form-check-input" type="checkbox" role="switch" id="payWithPaypal">' +
      '            <label class="form-check-label text-white" for="flexSwitchCheckDefault">Tạo đơn thanh toán Paypal</label>' +
      '            </div></div>' +
      '          </div>\n' +
      '<div id="container-paypal" class="hiddenPaypal"><div id="myPaypal"></div></div>' +
      '          <div id="momoMethod">\n' +
      '            <h4 class="text-white">Momo</h4>\n' +
      '            <div class="form-group"><div class="form-check form-switch">' +
      '            <input class="form-check-input" type="checkbox" role="switch" id="payWithMomo">' +
      '            <label class="form-check-label text-white" for="flexSwitchCheckDefault">Tạo đơn thanh toán MoMo</label>' +
      '            </div></div>' +
      '          </div>\n' +
      '        </div>\n' +
      '        <p class="text-danger font-italic text-center">*Vui lòng chọn phương thức thanh toán</p>';
    document.getElementById('payWithPaypal').addEventListener('change', () => {
      this.statePaypal(id);
    });
    document.getElementById('payWithMomo').addEventListener('change', () => {
      this.stateMomo(id);
    });
  }

  /**
   * Create: LuanND
   * Date: 17/08/2022
   * Description: get list service of customer and format money
   * @param id: is ID of payment object to get list service customer
   * return none
   */
  getService(id: number) {
    const formatter = Intl.NumberFormat('decimal', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    // tslint:disable-next-line:max-line-length
    let content = `<p style="text-align: right; margin: 5px 10px; font-weight: bold; font-size: 13px; font-style: italic; color: white;">Đơn vị tính: VND</p>
      <table class="table table-striped table-dark"><thead><tr><th>Tên dịch vụ</th><th>Số lượng</th><th>Đơn vị</th>
      <th>Đơn giá</th><th>Tổng tiền</th></tr></thead><tbody>`;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.listPayment.length; i++) {
      if (this.listPayment[i].id === id) {
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < this.listPayment[i].paymentDetailList.length; j++) {
          content += '<tr>' +
            '<td>' + this.listPayment[i].paymentDetailList[j].product.nameProduct + '</td>' +
            '<td>' + this.listPayment[i].paymentDetailList[j].amount + '</td>' +
            '<td>' + this.listPayment[i].paymentDetailList[j].product.unit + '</td>' +
            '<td>' + formatter.format(this.listPayment[i].paymentDetailList[j].product.prices) + '</td>' +
            // tslint:disable-next-line:max-line-length
            '<td>' + formatter.format(this.listPayment[i].paymentDetailList[j].product.prices * this.listPayment[i].paymentDetailList[j].amount) + '</td>';
        }
        // tslint:disable-next-line:max-line-length
        content += '</tr> + ' + '<tr><td colspan="4"> Tổng tiền dich vụ: </td>' + '<td rowspan="2">' + formatter.format(this.listPayment[i].totalPay) + '</td></tr>';
      }
    }
    content += `</tbody></table>`;
    document.getElementById('body-service').innerHTML = content;
  }
  paymentWithPaypal(id: number) {
    document.getElementById('myPaypal').innerHTML = '';
    let reponseBody: ReponseBody = {};
    let obj: Payment = {};
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.listPayment.length; i++) {
      if (this.listPayment[i].id === id) {
        obj = this.listPayment[i];
      }
    }
    /**
     * Created by: LuanND
     * Date created: 11/08/2022
     * @render() : execute load sandbox Paypal fill block
     * @param id : Position will be render load
     * @param currency : unit currency payment
     * @param value : total money need payment
     * @param onApprove : it'll be execute when payment has approved
     */
    render(
      {
        id: '#myPaypal',
        currency: 'VND',
        value: (obj.totalPay / 23000).toFixed(2).toString(),
        onApprove: (details) => {
          this.obj = details;
          this.totalPay = obj.totalPay;
          this.paymentService.setStatePayment(id).subscribe();
          $('#modelPaymentMethodId').modal('hide');
          $('#modelResultId').modal('show');
          this.toast.success('Thanh toán thành công.');
          this.getPage(this.page);
          // Number(details.purchase_units[0].amount.value)
          reponseBody = {
            id: details.id,
            status: details.status,
            value: this.totalPay,
            email: details.purchase_units[0].payee.email_address,
            fullName: details.purchase_units[0].shipping.name.full_name,
            address: details.purchase_units[0].shipping.address.address_line_1,
            area1: details.purchase_units[0].shipping.address.admin_area_1,
            area2: details.purchase_units[0].shipping.address.admin_area_2,
            postalCode: Number(details.purchase_units[0].shipping.address.postal_code),
            countryCode: details.purchase_units[0].shipping.address.country_code
          };

          this.paymentService.sendEmail(reponseBody).subscribe(value => {
            console.log(value);
          });

          this.updateCustomer(id);
          this.productService.setDataProduct(id).subscribe(value => {
            console.log(value);
          });
        }
      }
    );
  }

  /**
   * Create: LuanND
   * Date: 17/08/2022
   * Description: Method payment by Momo
   * @pram id: is ID of object payment to create request
   * return none
   */
  paymentWithMomo(id: number) {
    let obj: Payment = {};
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.listPayment.length; i++) {
      if (this.listPayment[i].id === id) {
        obj = this.listPayment[i];
      }
    }
    const secretKey = 'uTN3B8kxMCACzETTwqSLrEMNKl7qfXWt';
    const accessKey = 'kSj697M5vBZ5V4iO';
    const orderInfo = 'Test';
    const partnerCode = 'MOMOUVVS20220801';
    const redirectUrl = 'http://localhost:4200/payment';
    const ipnUrl = 'http://localhost:4200/payment';
    // QR : captureWallet
    // ATM : payWithATM
    // Momo wallet : linkWallet
    const requestType = 'captureWallet';
    const amount = obj.totalPay.toString();
    const orderId = (partnerCode + new Date().getTime()).toString();
    const requestId = orderId.toString();
    const extraData = '';
    const lang = 'vi';

    const rawSignature =
      'accessKey=' + accessKey +
      '&amount=' + amount +
      '&extraData=' + extraData +
      '&ipnUrl=' + ipnUrl +
      '&orderId=' + orderId +
      '&orderInfo=' + orderInfo +
      '&partnerCode=' + partnerCode +
      '&redirectUrl=' + redirectUrl +
      '&requestId=' + requestId +
      '&requestType=' + requestType;

    const crypto = require('crypto');
    const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');
    console.log('signature: ' + signature);

    // Capture, ATM
    const requestBody = JSON.stringify({
      partnerCode,
      accessKey,
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      extraData,
      requestType,
      signature,
      lang
    });

    const p = new Promise((resolve, reject) => {
      const xmlHttpRequest = new XMLHttpRequest();
      // https://test-payment.momo.vn/v2/gateway/api/create
      // https://test-payment.momo.vn/gw_payment/transactionProcessor
      xmlHttpRequest.open('POST', 'https://test-payment.momo.vn/v2/gateway/api/create');
      xmlHttpRequest.setRequestHeader('Content-Type', 'application/json');
      xmlHttpRequest.send(requestBody);

      xmlHttpRequest.onload = () => {
        if (xmlHttpRequest.status === 200) {
          resolve(xmlHttpRequest.response);
        } else {
          reject('Error call API');
        }
      };
    });

    p.then(value => {
      console.log('thành công');
      const jObject = JSON.parse(value.toString());
      console.log(jObject);
      const resultCode = jObject.resultCode;
      if (resultCode === 0) {
        window.location.href = jObject.payUrl;
      }
    }, reason => {
      console.log(reason);
    });
  }

  /**
   * Create: LuanND
   * Date: 17/08/2022
   * Description: add time play for customer
   * @param id: is ID of object customer to update time remaining
   * return none
   */
  updateCustomer(id: number) {
    this.paymentService.getById(id).subscribe(value => {
      const customer = value.record.customer;
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < value.paymentDetailList.length; i++) {
        if (value.paymentDetailList[i].product.id === 11) {
          customer.remainingTime += value.paymentDetailList[i].amount * 3600;
          this.customerService.setTimeRemaining(customer.id, customer.remainingTime).subscribe(mapList => {
            console.log(mapList);
          });
        }
      }
    });
  }

  /**
   * Create: LuanND
   * Date: 17/08/2022
   * Description: get page from API
   * @param page: is position to request to API get list
   * return Page<Payment>
   */
  getPage(page) {
    if (Number(page) < 0 || Number(page) > this.totalPages) {
      this.toast.error('Vui lòng nhập đúng');
    }
    this.page = Number(page);
    page = Number(page) - 1;
    this.paymentService.getAllPagePayment(Number(page)).subscribe((value: any) => {
      this.listPayment = value.content;
      this.totalItems = value.totalElements;
      this.totalPages = value.totalPages;
      this.calculatorPayment();
    });
  }

  /**
   * Create: LuanND
   * Date: 17/08/2022
   * Description: check list for detail or all record
   * return Page<Payment>
   */
  checkList() {
    if (this.listPayment.length === 1) {
      this.route.navigateByUrl('');
    } else {
      if (this.page === 0) {
        this.getAllPayment();
      } else {
        this.getPage(this.page);
      }
    }
  }
}
