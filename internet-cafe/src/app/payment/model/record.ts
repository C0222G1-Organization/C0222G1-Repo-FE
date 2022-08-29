import { Customer } from 'src/app/customer/model/customer';
import { Computer } from 'src/app/computer/model/computer';
import { Payment } from './payment';

export interface Record {
  id: number;
  startTime: string;
  endTime: string;
  customer: Customer;
  computer: Computer;
  payment: Payment;
}
