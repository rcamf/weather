import { Component, OnInit } from '@angular/core';
import { EndpointService } from '../services/endpoint.service';
import { EndpointData } from '../interfaces';

@Component({
  selector: 'app-endpoints',
  templateUrl: './endpoints.component.html',
  styleUrls: ['./endpoints.component.scss']
})
export class EndpointsComponent implements OnInit {
  endpoints: EndpointData[] = []
  result: string = null

  constructor(private apiservice: EndpointService) { }

  ngOnInit(): void {
    this.apiservice.doRequestEndpoints()
      .subscribe(
        data => {
          this.endpoints = data.data
        },
        err => console.log(err)
      )
  }

  handleSubmit(event: Event): void {
    let input: HTMLInputElement = <HTMLInputElement>document.getElementById('name')
    if (input.value !== "") {
      this.apiservice.doPostEndpoint(input.value)
        .subscribe(
          data => {
            this.result = `{\n\tname: "${data.data.name}"\n\turl: "${data.data.url}"\n}`
            this.apiservice.doRequestEndpoints()
              .subscribe(
                data => {
                  this.endpoints = data.data
                },
                err => console.log(err)
              )
          },
          err => this.result = err
        )
      input.value = ""
    } else this.result = "Du musst einen Namen eingeben"
  }
}
