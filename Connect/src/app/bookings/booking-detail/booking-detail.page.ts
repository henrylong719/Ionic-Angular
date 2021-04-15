import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
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
    private bookingService: BookingService
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
          console.log(this.booking);
          this.isLoading = false;
        });
    });
  }

  slideOpts = {
    initialSlide: 1,
    speed: 400,
  };
}
