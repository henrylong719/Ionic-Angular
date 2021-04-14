import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {
  offers: Place[] = [];
  private authSub: Subscription;
  private placeSub: Subscription;
  isLoading: boolean;

  private deleteBookingSub: Subscription;
  private userId: string;

  constructor(
    private placeService: PlacesService,
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.placeService.places
      .pipe(
        map((places: any) => {
          return places.filter((place) => {
            return place.userId === this.userId;
          });
        })
      )
      .subscribe((places) => {
        this.isLoading = false;
        this.offers = places;
      });
  }

  ionViewWillEnter() {
    this.isLoading = true;

    this.placeSub = this.authService.userId
      .pipe(
        take(1),
        switchMap((id) => {
          this.userId = id;
          console.log(this.userId);
          return this.placeService.fetchPlaces();
        }),
        map((places: any) => {
          return places.filter((place) => {
            return place.userId === this.userId;
          });
        })
      )
      .subscribe((places) => {
        this.offers = places;
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
        message: 'Deleting...',
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
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
    if (this.deleteBookingSub) {
      this.deleteBookingSub.unsubscribe();
    }
  }
}
