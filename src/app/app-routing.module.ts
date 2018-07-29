import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdateLogsComponent } from './update-logs/update-logs.component';
import { LoginComponent } from './login/login.component';
import { InitializrComponent } from './initializr/initializr.component';
import { AuthService } from './auth.service';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'updates', component: UpdateLogsComponent },
  {
    path: 'initializr',
    loadChildren: 'app/initializr/initializr.module#InitializrModule',
    canActivate: [ AuthService ]
  },
  {
    path: '',
    loadChildren: 'app/blog/blog.module#BlogModule'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
