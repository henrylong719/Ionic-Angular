import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { MapModalComponent } from 'src/app/shared/map-modal/map-modal.component';
import { Booking } from '../booking.model';
import { BookingService } from '../booking.service';

@Component({
  selector: 'app-booking-detail',
  templateUrl: './booking-detail.page.html',
  styleUrls: ['./booking-detail.page.scss'],
})
export class BookingDetailPage implements OnInit {
  public booking: Booking;
  public isLoading: boolean;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private modelCtrl: ModalController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('bookingId')) {
        this.navCtrl.navigateBack('/bookings');
        return;
      }

      this.isLoading = true;

      this.bookingService
        .getBooking(paramMap.get('bookingId'))
        .subscribe((booking) => {
          this.booking = booking;
          // console.log(this.booking);
          this.isLoading = false;
        });
    });
  }

  // for slides
  slideOpts = {
    initialSlide: 1,
    speed: 400,
  };

  onShowFullMap() {
    this.modelCtrl
      .create({
        component: MapModalComponent,
        componentProps: {
          center: {
            lat: this.booking.location.lat,
            lng: this.booking.location.lng,
          },
          selectable: false,
          closeButtonText: 'Close',
          title: this.booking.location.address,
        },
      })
      .then((modalEl) => {
        modalEl.present();
      });
  }
}
