import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { InitializrRoutingModule } from './initializr-routing.module';
import { InitializrComponent } from './initializr.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    InitializrRoutingModule
  ],
  exports: [],
  declarations: [
    InitializrComponent
  ],
  providers: [],
})
export class InitializrModule { }
