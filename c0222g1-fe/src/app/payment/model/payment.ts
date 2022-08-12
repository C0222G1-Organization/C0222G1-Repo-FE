import {Record} from './record';
import {PaymentDetail} from './payment-detail';

export interface Payment {
  id?: number;
  paymentCode?: string;
  record?: Record;
  paymentDetailList?: PaymentDetail[];
  paymentStatus?: number;
  totalPay?: number;
}
