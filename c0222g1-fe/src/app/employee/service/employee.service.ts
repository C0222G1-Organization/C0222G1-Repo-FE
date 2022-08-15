import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Employee} from "../model/employee";
import {environment} from "../../enviroment";
import {Position} from "../model/position";

const apiUrl = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})


export class EmployeeService {

  constructor(private httpClient: HttpClient) {
  }

  getEmployeeList(page: number,
                  code: string,
                  name: string,
                  dobfrom: string,
                  dobend: string,
                  workf: string,
                  workt: string,
                  pid: string,
                  address: string): Observable<Employee[]> {

    if (dobfrom === '') {
      dobfrom = '1900-01-01';
    }

    if (dobend === '') {
      dobend = '9999-12-31';
    }
    if (workf === '') {
      workf = '0000-00-00';
    }
    if (workt === '') {
      workt = '9999-12-31';
    }
    let params = new HttpParams();
    params = params.append('code', code);
    params = params.append('name', name);
    params = params.append('dobend', dobend);
    params = params.append('dobfrom', dobfrom);
    params = params.append('workt', workt);
    params = params.append('workf', workf);
    params = params.append('pid', pid);
    params = params.append('address', address);

    return this.httpClient.get<Employee[]>(apiUrl + `/employee/${page}`, {params});
  }

  getPositionList(): Observable<Position[]> {
    return this.httpClient.get<Position[]>(apiUrl + `/employee/position`);
  }

  deleteEmployee(id: number): Observable<void> {
    return this.httpClient.delete<void>(apiUrl + `/employee/${id}`);
  }
}
