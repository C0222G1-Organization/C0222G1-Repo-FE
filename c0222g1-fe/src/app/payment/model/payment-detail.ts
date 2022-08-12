import {Payment} from './payment';
import {Product} from './product';

export interface PaymentDetail {
  id?: number;
  amount: number;
  payment: Payment;
  product: Product;
}
