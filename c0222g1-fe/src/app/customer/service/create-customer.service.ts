import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Province} from '../model/province';
import {District} from '../model/district';
import {Commune} from '../model/commune';
import {UpdateCustomerDto} from '../model/customer-update-dto';

@Injectable({
  providedIn: 'root'
})
export class CreateCustomerService {
  API_URL = 'http://localhost:8080/';
  constructor(private http: HttpClient) { }

  getAllProvince(): Observable<Province[]> {
    return this.http.get<Province[]>(this.API_URL + 'address/province');
  }

  getAllDistrict(provinceId: number): Observable<District[]> {
    return this.http.get<District[]>(this.API_URL + 'address/district/' + provinceId);
  }

  getAllCommune(districtId: number): Observable<Commune[]> {
    return this.http.get<Commune[]>(this.API_URL + 'address/commune/' + districtId);
  }
  createCustomer(updateCustomerDto: UpdateCustomerDto): Observable<void> {
    return this.http.post<void>(this.API_URL + 'customer', updateCustomerDto);
  }

  checkUserName(userName: string): Observable<string> {
    return this.http.get<string>(this.API_URL + 'customer/checkUserName/' + userName);
  }

  checkEmail(email: string): Observable<string> {
    return this.http.get<string>(this.API_URL + 'customer/checkEmail/' + email);
  }

  checkPhone(phone: string): Observable<string> {
    return this.http.get<string>(this.API_URL + 'customer/checkPhone/' + phone);
  }
}
