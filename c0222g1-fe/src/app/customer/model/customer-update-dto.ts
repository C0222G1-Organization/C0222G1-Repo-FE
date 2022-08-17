import {EmailDto} from './email-dto';
import {PhoneDto} from './phone-dto';
import {UserDto} from './user-dto';
import {Commune} from './commune';

export interface UpdateCustomerDto {
  id?: number;
  name?: string;
  dateOfBirth?: string;
  email?: EmailDto;
  phoneNumber?: PhoneDto;
  userName?: UserDto;
  password?: string;
  activeStatus?: number;
  commune?: Commune;
  remainingTime?: number;
}
