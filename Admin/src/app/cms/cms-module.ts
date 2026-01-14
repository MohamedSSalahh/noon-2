import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { CmsRoutingModule } from './cms-routing-module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CmsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class CmsModule { }
