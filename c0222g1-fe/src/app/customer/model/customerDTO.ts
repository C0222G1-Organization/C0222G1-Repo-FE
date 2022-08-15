import {Commune} from './commune';

export interface CustomerDTO {
  id?: number;
  name?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  email?: string;
  activeStatus?: number;
  deleteStatus?: number;
  remainingTime?: number;
  nameCommune?: string;
  nameDistrict?: string;
  nameProvince?: string;
  starDate?: string;
  endDate?: string;
  address?: string;
  nameCustomer?: string;
  checked?:boolean
}
