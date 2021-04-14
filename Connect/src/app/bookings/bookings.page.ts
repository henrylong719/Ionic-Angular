import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Booking } from './booking.model';
import { BookingService } from './booking.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {
  loadedBookings: Booking[];
  isLoading: boolean = false;

  bookingSub: Subscription;
  cancelBookingSub: Subscription;
  constructor(
    private bookingService: BookingService,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.bookingSub = this.bookingService.bookings.subscribe((bookings) => {
      console.log('test1');
      this.loadedBookings = bookings;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;

    this.bookingService.fetchBooking().subscribe(() => {
      console.log('test2');
      this.isLoading = false;
    });
  }

  onCancelBooking(bookingId: string, slidingEl: IonItemSliding) {
    slidingEl.close();
    // cancel booking

    this.loadingCtrl
      .create({ message: 'Cancelling ....' })
      .then((loadingEl) => {
        loadingEl.present();

        this.cancelBookingSub = this.bookingService
          .cancelBooking(bookingId)
          .subscribe(() => {
            loadingEl.dismiss();
          });
      });
  }

  ngOnDestroy() {
    if (this.bookingSub) {
      this.bookingSub.unsubscribe();
    }

    if (this.cancelBookingSub) {
      this.cancelBookingSub.unsubscribe();
    }
  }
}
