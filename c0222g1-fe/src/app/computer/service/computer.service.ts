import {Injectable} from '@angular/core';
import {environment} from "../../enviroment";
import {Computer} from "../model/computer";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

const API_URL = `${environment.apiUrl}`

@Injectable({
  providedIn: 'root'
})
export class ComputerService {

  constructor(private http: HttpClient) {
  }

  createComputer(computer: Computer): Observable<Computer> {
    return this.http.post<Computer>(API_URL + '/create-computer', computer)
  }
}
