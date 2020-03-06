import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-data",
  templateUrl: "./data.component.html",
  styleUrls: ["./data.component.scss"]
})
export class DataComponent implements OnInit {
  @Input() header: any;
  @Input() value: number;

  constructor() {}

  ngOnInit(): void {}
}
