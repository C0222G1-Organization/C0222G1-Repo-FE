import {Injectable} from '@angular/core';
import {environment} from "../../enviroment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ComputerType} from "../model/computer-type";

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class ComputerTypeService {

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<ComputerType[]> {
    return this.http.get<ComputerType[]>(API_URL + '/list-computer-type')
  }
}
