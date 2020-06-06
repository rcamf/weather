import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {
  endpoint: string


  constructor(private route: ActivatedRoute ) { }

  ngOnInit(): void {
    this.route
      .queryParamMap
      .pipe(map(params => params.get('e') || 'Default'))
      .subscribe(
        ep => this.endpoint = ep,
        err => console.log(err)
      )
  }

  handleSubmit(): void {
    let input = <HTMLInputElement>document.getElementById('searchBar')
    if (input.value !== "") this.endpoint = input.value
    input.value = ""  
  }
}
