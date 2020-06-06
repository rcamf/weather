import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, interval, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar'
import { EndpointService } from 'src/app/core/endpoint.service';
import { Endpoint } from 'src/app/core/directives/endpoint.directive';
import { WeatherData } from 'src/app/core/directives/weather-data.directive';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  imagePath = 'http://st.wetteronline.de/dr/1.1.162/city/prozess/graphiken/symbole/standard/farbe/svg/centered/so____.svg'
  endpoints: Endpoint[] = []
  filteredEndpoints: Observable<Endpoint[]>
  endpoint: Endpoint
  searchBar = new FormControl('')
  currentData: WeatherData
  data: WeatherData[]
  nextData: WeatherData[]
  endpointsRefreshInterval: Subscription

  constructor(private _snackBar: MatSnackBar, private endpointService: EndpointService) { }

  ngOnInit(): void {
    this.filteredEndpoints = this.searchBar.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      )
    this.endpointService.getEndpoints().subscribe(
      res => {
        this.endpoints = res.data
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(position => {
            const result = this.endpoints.sort((a, b) => this._distance(position, a) - this._distance(position, b))
            this.endpoint = result.length ? result[0] : null
            this._loadData(this.endpoint)
          })
        } else {
          this.endpoint = this.endpoints.length ? this.endpoints[0] : null
          this._loadData(this.endpoint)
        }
      }
    )
    this.endpointsRefreshInterval = interval(60000).subscribe(
      () => {
        this.endpointService.getEndpoints().subscribe(
          res => this.endpoints = res.data
        )
      }
    )
  }

  private _loadData(endpoint: Endpoint) {
    console.log(endpoint)
    if (!endpoint) return
    this.endpointService.getCurrentData(endpoint.id).subscribe(
      response => this.currentData = response.data,
      error => console.log(error)
    )
    this.endpointService.getData(endpoint.id).subscribe(
      response => this.data = response.data,
      error => console.log(error)
    )
    this.endpointService.getNextData(endpoint.id).subscribe(
      response => this.nextData = response.data,
      error => console.log(error)
    )
  }

  private _distance(position: Position, endpoint: Endpoint) {
    const R = 6371e3
    const φposition = position.coords.latitude * Math.PI / 180
    const φendpoint = endpoint.lat * Math.PI / 180
    const deltaφ = φendpoint - φposition
    const deltaλ = (endpoint.long - position.coords.longitude) * Math.PI / 180
    const a = Math.pow(Math.sin(deltaφ / 2), 2) + Math.cos(φposition) * Math.cos(φendpoint) * Math.pow(Math.sin(deltaλ / 2), 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const d = R * c
    return d
  }

  private _filter(value: string) {
    const filterValue = value ? value.toLowerCase() : ''

    return this.endpoints.filter(endpoint => (endpoint.city.toLowerCase() + ', ' + endpoint.country.toLowerCase()).includes(filterValue))
  }

  selectionChange(event) {
    if (this.searchBar.value !== '') {
      const temp = this.searchBar.value.split(',')
      let endpoint = {
        city: temp[0] ? temp[0].trim() : undefined,
        country: temp[1] ? temp[1].trim() : undefined
      }
      const endpointIndex = this.endpoints.findIndex(entry => endpoint.city === entry.city && endpoint.country === entry.country)
      if (endpointIndex === -1) {
        this._snackBar.open('The provided endpoint is invalid.', undefined, {
          duration: 2000,
          verticalPosition: 'top'
        })
      } else {
        this.endpoint = this.endpoints[endpointIndex]
        this._loadData(this.endpoint)
        this.searchBar.reset()
        this.searchBar.markAsPristine()
        this.searchBar.markAsUntouched()
      }
    }
  }

  ngOnDestroy() {
    this.endpointsRefreshInterval.unsubscribe()
  }
}
