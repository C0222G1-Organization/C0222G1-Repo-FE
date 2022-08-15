import { Payment } from './payment';
import { Product } from 'src/app/product/model/Product';

export interface PaymentDetail {
  id?: number;
  amount: number;
  payment: Payment;
  product: Product;
}
