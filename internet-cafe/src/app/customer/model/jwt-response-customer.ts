import {Customer} from './customer';

export interface JwtResponseCustomer {
  customer?: Customer;
  computerInUse?: number;
  computerCode?: string;
  startTime?: string;
  endTime?: string;
}
