import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardEmployeeService implements CanActivate {

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const roles = localStorage.getItem('roles');
    if (roles === 'EMPLOYEE') {
      return true;
    } else {
      this.router.navigateByUrl('/403');
    }
  }
}
