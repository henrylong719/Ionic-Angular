import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {
  offers: Place[] = [];
  private placesSub: Subscription;
  isLoading: boolean;

  private deleteBookingSub: Subscription;

  constructor(
    private placeService: PlacesService,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.placesSub = this.placeService.places.subscribe((places) => {
      this.offers = places;
    });

    // this.offers = this.placeService.places;
  }

  ionViewWillEnter() {
    this.isLoading = true;

    this.placeService.fetchPlaces().subscribe(() => {
      this.isLoading = false;
    });
  }

  onEdit(offerId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['/', 'places', 'tabs', 'offers', 'edit', offerId]);
  }

  onDelete(offerId: string) {
    this.loadingCtrl
      .create({
        message: 'Deleting',
      })
      .then((loadingEl) => {
        loadingEl.present();

        this.deleteBookingSub = this.placeService
          .deletePlace(offerId)
          .subscribe(() => {
            loadingEl.dismiss();
          });
      });
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}
