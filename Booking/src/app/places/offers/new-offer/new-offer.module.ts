import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewOfferPageRoutingModule } from './new-offer-routing.module';

import { NewOfferPage } from './new-offer.page';
import { sharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    NewOfferPageRoutingModule,
    ReactiveFormsModule,
    sharedModule,
  ],
  declarations: [NewOfferPage],
})
export class NewOfferPageModule {}
