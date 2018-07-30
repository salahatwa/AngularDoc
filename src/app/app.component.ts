import { Component, ViewChild, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { OverlayContainer } from '@angular/cdk/overlay';

import { GitProxyService } from './git-proxy.service';
import { ConfService } from './conf.service';
import { AuthService } from './auth.service';
import { AboutMeComponent } from './about-me/about-me.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title: string;
  isDark: boolean;

  constructor(
    private overlayContainer: OverlayContainer,
    private router: Router,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private gitProxyService: GitProxyService,
    public confService: ConfService,
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.confService.initConfig();
    // this.title = this.confService.config.repo;
    this.title = 'Salah atwa';
    this.isDark = false;
    let accessToken = sessionStorage.getItem('access_token');
    if (accessToken) {
      this.gitProxyService
      .getAuthUserInfo(accessToken)
      .then(
        user => {
          this.authService.login(accessToken, user);

        }
      );
    }
  }

  ifYkdoc(): boolean {
    return this.confService.config.owner == 'yorkecao' && this.confService.config.repo == 'yorkecao';
  }

  openDialog(): void {
    let dialogRef = this.dialog.open(AboutMeComponent, {
      minWidth: '25vw',
      minHeight: '30vh'
    });
  }

  toggleTheme(): void {
    if (!this.isDark) {
      this.overlayContainer.getContainerElement().classList.add('unicorn-dark-theme');
    } else {
      this.overlayContainer.getContainerElement().classList.remove('unicorn-dark-theme');
    }
  }

  logout(): void {
    this.authService.logout();
    this.snackBar.open("Logged out", "", {
      duration: 600,
    });
  }
}

