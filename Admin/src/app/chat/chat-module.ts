import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { ChatRoutingModule } from './chat-routing-module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ChatRoutingModule,
    FormsModule,
    HttpClientModule
  ]
})
export class ChatModule { }
