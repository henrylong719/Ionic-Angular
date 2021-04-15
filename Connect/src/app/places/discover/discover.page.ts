import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { take } from 'rxjs/operators';

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
  isLoading: boolean = false;

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

  ionViewWillEnter() {
    // if there are already loaded place, then not showing spinner
    if (this.loadedPlaces.length === 0) this.isLoading = true;

    this.placesService.fetchPlaces().subscribe(() => {
      this.isLoading = false;
    });
  }

  // onOpenMenu() {
  //   this.menuCtrl.toggle('m1');
  // }

  // event: CustomEvent<SegmentChangeEventDetail>
  onFilterUpdate(event) {
    this.authService.userId.pipe(take(1)).subscribe((userId) => {
      if (event.detail.value === 'all') {
        this.relevantPlaces = this.loadedPlaces;
        this.listedLoadedPlaces = this.relevantPlaces.slice(1);
      } else {
        this.relevantPlaces = this.loadedPlaces.filter(
          (place) => place.userId !== userId
        );

        // console.log(this.relevantPlaces);
        this.listedLoadedPlaces = this.relevantPlaces.slice(1);
      }

      // console.log(event.detail);
    });
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}
