import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { fromEvent, Observable, throwError } from 'rxjs';
import { catchError, map, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ip-address-tracker';

  map: any;

  marker: any;

  ipAddress: any;

  ip: any

  location: any;

  timezone: any;

  isp: any;

  apiKey = 'at_yk21c6IhIFbVviUdbHHp3F8zrAR7G';

  icon = L.icon({
    iconUrl: '../assets/images/icon-location.svg',
    iconSize: [50, 60],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
    shadowSize: [68, 95],
    shadowAnchor: [22, 94]
  });

  submiting = false;

  // error: string = '';
  error : any;
  errorMssg: any;

  constructor(
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.generateMap(19.125362, 72.999199);
  }

  generateMap(lat: number, lng: number){
    this.map = L.map('map').setView([lat, lng], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    this.marker = L.marker([lat, lng], {icon: this.icon}).addTo(this.map);
  }

  onSubmit(){
    const url = `https://geo.ipify.org/api/v1?apiKey=${this.apiKey}&ipAddress=${this.ipAddress}`;
    this.submiting = true;
    this.http.get(url).pipe(
      map((data) => {
        return data;
      }), catchError(this.handleError)
    ).subscribe((res: any) => {
      this.map.setView([res.location.lat, res.location.lng], 13);
      this.marker.setLatLng([res.location.lat, res.location.lng]);

      this.ip = res.ip;
      this.location = res.location.city + ',' + res.location.country;
      this.timezone = res.location.timezone;
      this.isp = res.isp;

      this.submiting = false;
    },
    (err: any) => {
        this.submiting = false;
        this.error = true;
        this.errorMssg = err?.error?.messages;
        setTimeout(() => {
          this.error = false;
          this.errorMssg = '';
        }, 4000);
      } 
    );
  }

  private handleError(error: HttpErrorResponse) {
    
    return throwError(error);
  }
}
