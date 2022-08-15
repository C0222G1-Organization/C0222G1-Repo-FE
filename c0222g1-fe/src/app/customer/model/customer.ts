import {Commune} from './commune';
import {User} from '../../authentication/model/user';

export interface Customer {
  id?: number;
  name?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  email?: string;
  activeStatus?: number;
  deleteStatus?: number;
  remainingTime?: number;
  user?: User;
  commune?: Commune;
}
