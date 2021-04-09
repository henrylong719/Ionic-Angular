import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Place } from './place.model';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([
    new Place(
      'p1',
      'Manhattan Mansion',
      'In the heart of New York City',
      'https://imgs.6sqft.com/wp-content/uploads/2014/06/21042533/Carnegie-Mansion-nyc.jpg',
      149.9,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'abc'
    ),

    new Place(
      'p2',
      "L'Amour Toujours",
      'A romantic place in Paris!',
      'https://cdn.shopify.com/s/files/1/0008/0802/products/P14-1198-Edit-2_1024x1024.jpg?v=1408738458',
      189.9,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'abcd'
    ),
    new Place(
      'p3',
      'The Foggy Palace',
      'Not your average city trip!',
      'https://s8.favim.com/orig/72/dracula-castle-fog-foggy-Favim.com-717423.jpg',
      89.9,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'avf'
    ),
  ]);

  constructor(private authService: AuthService) {}

  get places() {
    // return an observable
    return this._places.asObservable();
  }

  // get single place
  getPlace(id: string) {
    return this.places.pipe(
      take(1),
      map((places) => {
        return { ...places.find((p) => p.id === id) };
      })
    );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://s8.favim.com/orig/72/dracula-castle-fog-foggy-Favim.com-717423.jpg',
      price,
      dateFrom,
      dateTo,
      this.authService.userId
    );

    this.places.pipe(take(1)).subscribe((places) => {
      this._places.next(places.concat(newPlace));
    });
    // this._places.push(newPlace);
  }
}
