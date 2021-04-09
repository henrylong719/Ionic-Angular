import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  loadedPlaces: Place[];
  listedLoadedPlaces: Place[];
  private placesSub: Subscription;
  relevantPlaces: Place[];

  constructor(
    private placesService: PlacesService,
    // private menuCtrl: MenuController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.placesSub = this.placesService.places.subscribe((places) => {
      this.loadedPlaces = places;
      this.relevantPlaces = this.loadedPlaces;
      this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    });
  }

  // ionViewWillEnter() {
  //   this.loadedPlaces = this.placesService.places;
  //   this.listedLoadedPlaces = this.loadedPlaces.slice(1);
  // }

  // onOpenMenu() {
  //   this.menuCtrl.toggle('m1');
  // }

  // event: CustomEvent<SegmentChangeEventDetail>
  onFilterUpdate(event) {
    if (event.detail.value === 'all') {
      this.relevantPlaces = this.loadedPlaces;
      this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    } else {
      console.log('test');
      this.relevantPlaces = this.loadedPlaces.filter(
        (place) => place.userId !== this.authService.userId
      );

      console.log(this.relevantPlaces);
      this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    }

    console.log(event.detail);
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}
