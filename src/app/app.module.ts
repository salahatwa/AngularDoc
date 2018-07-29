import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MatPaginatorIntl } from '@angular/material';

import { CookieModule } from 'ngx-cookie';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { UpdateLogsComponent } from './update-logs/update-logs.component';
import { CommitContentComponent } from './update-logs/commit-content/commit-content.component';
import { AboutMeComponent } from './about-me/about-me.component';
import { LoginComponent } from './login/login.component';
import { ConfService } from './conf.service';
import { GitProxyService } from './git-proxy.service';
import { UtilsService } from './utils.service';
import { AuthService } from './auth.service';

@NgModule({
  declarations: [
    AppComponent,
    UpdateLogsComponent,
    CommitContentComponent,
    AboutMeComponent,
    LoginComponent
  ],
  entryComponents: [
    AboutMeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    HttpClientModule,
    SharedModule,
    CookieModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    MatPaginatorIntl,
    ConfService,
    GitProxyService,
    AuthService,
    UtilsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
