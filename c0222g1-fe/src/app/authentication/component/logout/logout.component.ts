import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../service/auth.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private authService: AuthService, private toartrs: ToastrService, private router: Router) { }

  ngOnInit(): void {
    this.logout();
  }

  logout() {
    sessionStorage.clear();
    this.authService.sendData('login', false);
    this.toartrs.success('Đã đăng xuất', );
    this.router.navigate(['']);
  }

}
