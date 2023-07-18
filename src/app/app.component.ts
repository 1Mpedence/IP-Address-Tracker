import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {  throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

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

  urlHeader = `https://geo.ipify.org/api/v1?apiKey=${this.apiKey}`;

  icon = L.icon({
    iconUrl: '../assets/images/icon-location.svg',
    iconSize: [50, 60],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
    shadowSize: [68, 95],
    shadowAnchor: [22, 94]
  });

  submiting = false;

  error : any;

  errorMssg: string = '';

  constructor(
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.submiting = true;
    this.api(this.urlHeader)
    .subscribe(
      (res: any) => {
        this.generateMap(res.location.lat, res.location.lng)
        this.submiting = false;
      },
      (err) => {
        this.onError(err);
      }
    )
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
    const url = `${this.urlHeader}&ipAddress=${this.ipAddress}`;
    this.submiting = true;
    
    this.api(url)
    .subscribe(
      (res: any) => {
        this.map.setView([res.location.lat, res.location.lng], 13);
        this.marker.setLatLng([res.location.lat, res.location.lng]);

        this.ip = res.ip;
        this.location = res.location.city + ',' + res.location.country;
        this.timezone = res.location.timezone;
        this.isp = res.isp;

        this.submiting = false;
      },
      (err: any) => {
        this.onError(err);
        setTimeout(() => {
          this.error = false;
          this.errorMssg = '';
        }, 4000);
      } 
    );
  }

  onError(err: any) {
    this.submiting = false;
    this.error = true;
    this.errorMssg = err?.error?.messages;
  }

  api(url: string) {
    return this.http.get(url).pipe(
      map((data) => {
        return data;
      }, catchError(this.handleError)),
    );
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
