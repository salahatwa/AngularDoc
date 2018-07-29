import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { CookieService } from 'ngx-cookie';

import { AuthService } from '../auth.service';
import { GitProxyService } from '../git-proxy.service';
import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  accessToken: string;
  isStar = true;

  constructor(
    private location: Location,
    public router: Router,
    public snackBar: MatSnackBar,
    private authService: AuthService,
    private gitProxyService: GitProxyService,
    private utilsService: UtilsService,
    private _cookieService:CookieService
  ) { }

  ngOnInit() {
    let cookieIsStar = this._cookieService.get('isStar');
    this.isStar = cookieIsStar
      ? cookieIsStar == 'true'
      : true;
  }

  login(): void {
    let date = new Date();
    date.setDate(new Date().getDate() + 15);
    this._cookieService.put('isStar', '' + this.isStar, {
      expires: date
    });
    this.gitProxyService
      .getAuthUserInfo(this.accessToken)
      .then(
        user => {
          this.authService.login(this.accessToken, user);
          if (this.isStar) {
            this.gitProxyService.starred('yorkecao', 'yorkecao', this.accessToken);
          }
          if (this.authService.redirectUrl) {
            this.router.navigate([this.authService.redirectUrl]);
            this.authService.redirectUrl = '';
          } else {
            this.location.back();
          }

          this.snackBar.open("欢迎：" + user.name + "！", "", {
            duration: 1000
          });
        }
      ).catch(error => this.snackBar.open(this.utilsService.getErrorInfo(error), "", {
        duration: 1000,
      }));
  }

  logout() {
    this.authService.logout();
  }
}
