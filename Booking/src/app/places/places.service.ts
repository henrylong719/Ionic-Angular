import { Injectable } from '@angular/core';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places: Place[] = [
    new Place(
      'p1',
      'Manhattan Mansion',
      'In the heart of New York City',
      'https://imgs.6sqft.com/wp-content/uploads/2014/06/21042533/Carnegie-Mansion-nyc.jpg',
      149.9
    ),
    new Place(
      'p2',
      "L'Amour Toujours",
      'A romantic place in Paris!',
      'https://cdn.shopify.com/s/files/1/0008/0802/products/P14-1198-Edit-2_1024x1024.jpg?v=1408738458',
      189.9
    ),
    new Place(
      'p3',
      'The Foggy Palace',
      'Not your average city trip!',
      'https://s8.favim.com/orig/72/dracula-castle-fog-foggy-Favim.com-717423.jpg',
      89.9
    ),
  ];

  get places() {
    return [...this._places];
  }

  constructor() {}
}
