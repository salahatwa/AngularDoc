import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InitializrComponent } from './initializr.component';

const routes: Routes = [
  {
    path: '',
    component: InitializrComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InitializrRoutingModule { }
