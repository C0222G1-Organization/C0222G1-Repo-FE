import { Injectable } from '@angular/core';
import {environment} from '../../enviroment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Computer} from '../model/computer';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class ComputerService {

  constructor(private http: HttpClient) {}

  findAll(page: number, searchDto): Observable<Computer[]> {
    const params = new HttpParams().set('searchDto', searchDto);
    return this.http.get<Computer[]>(API_URL + `/computer/${page}`, {params});
  }
}
