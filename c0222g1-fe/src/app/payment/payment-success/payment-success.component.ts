import {Component, Input, OnInit} from '@angular/core';
import {PaymentService} from '../service/payment.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {
  data: any;

  constructor(private paymentService: PaymentService, private toast: ToastrService) {
    this.data = this.paymentService.getJson();
    const bodyElement = document.getElementsByTagName('body')[0];
    // Remove style modal
    bodyElement.removeAttribute('style');
    // Remove block div modal-backdrop
    bodyElement.removeChild(bodyElement.children[11]);
    // Remove class modal-open on body
    bodyElement.classList.remove('modal-open');
    // Add class clear-effect on body
    bodyElement.classList.add('clear-effect');
    this.toast.success('Payment successfully!', 'Payment');
  }

  ngOnInit(): void {
  }


}
