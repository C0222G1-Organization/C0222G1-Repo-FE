import {Component, OnInit} from '@angular/core';
import {render} from 'creditcardpayments/creditCardPayments';
import {PaymentService} from '../../service/payment.service';
import {Payment} from '../../model/payment';

@Component({
  selector: 'app-display-payment',
  templateUrl: './display-payment.component.html',
  styleUrls: ['./display-payment.component.css']
})
export class DisplayPaymentComponent implements OnInit {
  obj: any;
  listPayment: any = [];
  sPaypal = 0;
  page = 0;
  element: number;

  constructor(private paymentService: PaymentService) {
  }

  ngOnInit(): void {
    // Get list payment
    this.paymentService.getAllPayment().subscribe(value => {
      this.listPayment = value;
      // console.log(this.listPayment);
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.listPayment.length; i++) {
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < this.listPayment[i].paymentDetailList.length; j++) {
          // tslint:disable-next-line:max-line-length
          this.listPayment[i].totalPay += this.listPayment[i].paymentDetailList[j].amount * this.listPayment[i].paymentDetailList[j].product.prices;
        }
      }
    });
  }

  statePaypal(id: number) {
    if (this.sPaypal === 0) {
      this.paymentWithPaypal(id);
      document.getElementById('myPaypal').classList.remove('hiddenPaypal');
      document.getElementById('myPaypal').classList.add('displayPaypal');
      this.sPaypal = 1;
    } else {
      document.getElementById('myPaypal').classList.remove('displayPaypal');
      document.getElementById('myPaypal').classList.add('hiddenPaypal');
      this.sPaypal = 0;
    }
  }

  getPayment(id: number) {
    document.getElementById('body-payment').innerHTML = '<div class="container">\n' +
      '          <div id="paypalMethod">\n' +
      '            <h4>Paypal</h4>\n' +
      // tslint:disable-next-line:max-line-length
      '            <button class="btn btn-primary form-control mt-2 mb-2" id="payWithPaypal" ">Payment with Paypal</button>\n' +
      '            <div id="myPaypal" class="hiddenPaypal"></div>\n' +
      '          </div>\n' +
      '          <div id="momoMethod">\n' +
      '            <h4>Momo</h4>\n' +
      '            <button class="btn btn-primary form-control" id="payWithMomo" ">Momo</button>\n' +
      '          </div>\n' +
      '        </div>\n' +
      '        <p class="text-danger font-italic text-center">*Vui lòng chọn phương thức thanh toán</p>';
    document.getElementById('payWithPaypal').addEventListener('click', () => {
      this.statePaypal(id);
    });
    document.getElementById('payWithMomo').addEventListener('click', () => {
      this.paymentWithMomo(id);
    });
  }

  getService(id: number) {
    let content = '<div class="table-container" style="padding: 0 5px;">\n' +
      '          <p style="text-align: right; margin: 5px 10px; font-weight: bold; font-size: 13px; font-style: italic">\n' +
      '            Đơn vị tính: VND</p>\n' +
      '          <table class="table table-striped table-dark">\n' +
      '            <thead>\n' +
      '            <tr>\n' +
      '              <th>Tên dịch vụ</th>\n' +
      '              <th>Số lượng</th>\n' +
      '              <th>Đơn vị</th>\n' +
      '              <th>Đơn giá</th>\n' +
      '              <th>Tổng tiền</th>\n' +
      '            </tr>\n' +
      '            </thead>\n' +
      '            <tbody>';
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.listPayment.length; i++) {
      if (this.listPayment[i].id === id) {
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < this.listPayment[i].paymentDetailList.length; j++) {
          content += '<tr>\n' +
            '              <td>' + this.listPayment[i].paymentDetailList[j].product.name + '</td>\n' +
            '              <td>' + this.listPayment[i].paymentDetailList[j].amount + '</td>\n' +
            '              <td>' + this.listPayment[i].paymentDetailList[j].product.unit + '</td>\n' +
            '              <td>' + this.listPayment[i].paymentDetailList[j].product.prices + '</td>\n' +
            // tslint:disable-next-line:max-line-length
            '              <td>' + (this.listPayment[i].paymentDetailList[j].product.prices * this.listPayment[i].paymentDetailList[j].amount) + '</td>\n' +
            '            </tr>';
        }
      }
    }
    content += '</tbody>\n' +
      '          </table>';
    document.getElementById('body-service').innerHTML = content;
  }

  paymentWithPaypal(id: number) {
    document.getElementById('myPaypal').innerHTML = '';
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
     * @param(id) : Position will be render load
     * @param(currency) : unit currency payment
     * @param(value) : total money need payment
     * @param(onApprove) : it'll be execute when payment has approved
     */
    render(
      {
        id: '#myPaypal',
        currency: 'USD',
        value: obj.totalPay.toString(),
        onApprove: (details) => {
          this.obj = details;
          this.paymentService.setStatePayment(id).subscribe();
          this.ngOnInit();
        }
      }
    );
  }

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
    const redirectUrl = 'http://localhost:4200/payment/success';
    const ipnUrl = 'http://localhost:4200/payment/success';
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

  getPage(page: number) {
    this.page = page - 1;
  }
}
