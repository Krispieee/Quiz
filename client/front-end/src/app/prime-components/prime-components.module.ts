import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {CheckboxModule} from 'primeng/checkbox';
import {BadgeModule} from 'primeng/badge';
import {RatingModule} from 'primeng/rating';
import {PasswordModule} from 'primeng/password';
import {TableModule} from 'primeng/table';
import {InputMaskModule} from 'primeng/inputmask';
import {ToastModule} from 'primeng/toast';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {ConfirmPopupModule} from 'primeng/confirmpopup';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    CheckboxModule,
    BadgeModule,
    RatingModule,
    PasswordModule,
    TableModule,
    InputMaskModule,
    ToastModule,
    MessagesModule,
    MessageModule,
    ConfirmPopupModule
  ],
  exports :[
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    CheckboxModule,
    BadgeModule,
    RatingModule,
    PasswordModule,
    TableModule,
    InputMaskModule,
    ToastModule,
    MessagesModule,
    MessageModule,
    ConfirmPopupModule
  ]
})
export class PrimeComponentsModule { }
