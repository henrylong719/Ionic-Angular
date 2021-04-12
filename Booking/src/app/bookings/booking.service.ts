import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Booking } from './booking.model';

interface bookingData {
  bookedFrom: string;
  bookedTo: string;
  firstName: string;
  guestNumber: number;
  id: string;
  lastName: string;
  placeId: string;
  placeImage: string;
  placeTitle: string;
  userId: string;
}

@Injectable({ providedIn: 'root' })
export class BookingService {
  private _bookings = new BehaviorSubject<Booking[]>([]);

  constructor(private authService: AuthService, private http: HttpClient) {}

  get bookings() {
    // return [...this._booking];
    return this._bookings.asObservable();
  }

  addBooking(
    placeId: string,
    placeTitle: string,
    placeImage: string,
    firstName: string,
    lastName: string,
    guestNumber: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    let newBooking: Booking;
    let generatedId: string;
    let fetchedUserId: string;

    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        if (!userId) {
          throw new Error('Not user is found!');
        }

        fetchedUserId = userId;
        return this.authService.token;
      }),
      take(1),
      switchMap((token) => {
        newBooking = new Booking(
          null,
          placeId,
          fetchedUserId,
          placeTitle,
          placeImage,
          firstName,
          lastName,
          guestNumber,
          dateFrom,
          dateTo
        );
        return this.http.post<{ name: string }>(
          `https://ionic-angular-32a77-default-rtdb.firebaseio.com/booked-places.json?auth=${token}`,
          newBooking
          // {...newBooking, id:null}
        );
      }),
      switchMap((resData) => {
        generatedId = resData.name;
        return this.bookings;
      }),
      take(1),
      tap((bookings) => {
        newBooking.id = generatedId;
        this._bookings.next(bookings.concat(newBooking));
      })
    );
  }

  fetchBooking() {
    let fetchedUserId: string;
    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        if (!userId) {
          throw new Error('Not user is found!');
        }
        fetchedUserId = userId;
        return this.authService.token;
      }),

      take(1),
      switchMap((token) => {
        return this.http.get<{ [key: string]: bookingData }>(
          `https://ionic-angular-32a77-default-rtdb.firebaseio.com/booked-places.json?orderBy="userId"&equalTo="${fetchedUserId}"&auth=${token}`
        );
      }),
      map((resData) => {
        const bookings = [];

        for (let key in resData) {
          if (resData.hasOwnProperty(key)) {
            bookings.push(
              new Booking(
                key,
                resData[key].placeId,
                resData[key].userId,
                resData[key].placeTitle,
                resData[key].placeImage,
                resData[key].firstName,
                resData[key].lastName,
                resData[key].guestNumber,
                new Date(resData[key].bookedFrom),
                new Date(resData[key].bookedTo)
              )
            );
          }
        }
        return bookings;
      }),
      tap((bookings) => {
        this._bookings.next(bookings);
      })
    );
  }

  cancelBooking(bookingId: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.delete(
          `https://ionic-angular-32a77-default-rtdb.firebaseio.com/booked-places/${bookingId}.json?auth=${token}`
        );
      }),
      switchMap(() => {
        return this.bookings;
      }),
      take(1),
      tap((bookings) => {
        this._bookings.next(bookings.filter((b) => b.id !== bookingId));
      })
    );
  }
}
