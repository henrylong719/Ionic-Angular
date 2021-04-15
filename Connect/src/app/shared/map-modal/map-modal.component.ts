import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { environment } from '../../../environments/environment';
import { google } from 'google-maps';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private modelCtrl: ModalController,
    private renderer: Renderer2
  ) {}
  @ViewChild('map') mapElementRef: ElementRef;
  @ViewChild('searchBox') input: ElementRef;

  @Input() center = { lat: -34.9, lng: 138.5999 };
  @Input() selectable = true;
  @Input() closeButtonText = 'Cancel';
  @Input() title = 'Pick Location';

  clickListener: any;
  googleMaps: any;

  ngOnInit() {}

  onCancel() {
    this.modelCtrl.dismiss();
  }

  ngAfterViewInit() {
    this.getGoogleMaps()
      .then((googleMaps) => {
        this.googleMaps = googleMaps;
        const mapEl = this.mapElementRef.nativeElement;
        const map = new googleMaps.Map(mapEl, {
          center: this.center,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          disableDefaultUI: true,
          // mapTypeControl: true,
          // mapTypeControlOptions: {
          //   style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
          //   mapTypeIds: ['roadmap'],
          // },
        });

        googleMaps.event.addListenerOnce(map, 'idle', () => {
          this.renderer.addClass(mapEl, 'visible');
        });

        if (this.selectable) {
          const searchBox = new googleMaps.places.SearchBox(
            this.input.nativeElement
          );
          map.controls[googleMaps.ControlPosition.TOP_LEFT].push(
            this.input.nativeElement
          );

          // Bias the SearchBox results towards current map's viewport.
          map.addListener('bounds_changed', () => {
            searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
          });

          let markers: google.maps.Marker[] = [];

          // Listen for the event fired when the user selects a prediction and retrieve
          // more details for that place.
          searchBox.addListener('places_changed', () => {
            const places = searchBox.getPlaces();

            if (places.length == 0) {
              return;
            }

            // Clear out the old markers.
            markers.forEach((marker) => {
              marker.setMap(null);
            });

            markers = [];

            // For each place, get the icon, name and location.
            const bounds = new google.maps.LatLngBounds();
            places.forEach((place) => {
              if (!place.geometry || !place.geometry.location) {
                console.log('Returned place contains no geometry');
                return;
              }
              // const icon = {
              //   url: place.icon as string,
              //   size: new google.maps.Size(71, 71),
              //   origin: new google.maps.Point(0, 0),
              //   anchor: new google.maps.Point(17, 34),
              //   scaledSize: new google.maps.Size(30, 30),
              // };

              // Create a marker for each place.
              markers.push(
                new google.maps.Marker({
                  map,
                  // icon,
                  title: place.name,
                  position: place.geometry.location,
                })
              );

              if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
              } else {
                bounds.extend(place.geometry.location);
              }
            });

            map.fitBounds(bounds);
          });

          // get position from user
          this.clickListener = map.addListener('click', (event) => {
            const selectedCoords = {
              lat: event.latLng.lat(),
              lng: event.latLng.lng(),
            };
            this.modelCtrl.dismiss(selectedCoords);
          });
        } else {
          const marker = new googleMaps.Marker({
            position: this.center,
            map: map,
            title: 'Picked Location',
          });
          marker.setMap(map);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  private getGoogleMaps(): Promise<any> {
    const win = window as any;
    const googleModule = win.google;
    if (googleModule && googleModule.maps) {
      return Promise.resolve(googleModule.maps);
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsAPIKey}&libraries=places&language=en`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;
        if (loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject('Google maps SDK not available.');
        }
      };
    });
  }

  ngOnDestroy() {
    if (this.clickListener) {
      this.googleMaps.event.removeListener(this.clickListener);
    }
  }
}
