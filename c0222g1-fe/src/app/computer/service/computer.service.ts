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

  findAll(page: number, code, location, start, end, status, typeId): Observable<Computer[]> {
    let params = new HttpParams();
    params = params.append('code', code);
    params = params.append('location', location);
    params = params.append('start', start);
    params = params.append('end', code);
    params = params.append('status', status);
    params = params.append('typeId', typeId);
    return this.http.get<Computer[]>(API_URL + `/computer/${page}`, {params});
  }
}
