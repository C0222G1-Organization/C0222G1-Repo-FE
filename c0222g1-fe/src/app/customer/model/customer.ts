/**
 * Create by: DuyNT
 * Date Create: 11/08/2022
 * function: create interface customer
 */
export interface Customer {
  id: number;
  name: string;
  phoneNumber: string;
  dateOfBirth: string;
  email: string;
  activeStatus: number;
  deleteStatus: number;
  remainingTime: number;
  user: {
    userName: string;
    password: string;
  };
  commune: {
    id: number;
    name: string;
    district: {
      id: number;
      name: string;
      province: {
        id: number;
        name: string;
      }
    }
  };
}
