import { PaymentDetail } from './payment-detail';
import {Record} from './record';

export interface Payment {
  id?: number;
  paymentCode?: string;
  record?: Record;
  paymentDetailList?: PaymentDetail[];
  paymentStatus?: number;
  totalPay?: number;
}
