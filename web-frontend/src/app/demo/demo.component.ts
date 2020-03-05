import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ApiService } from '../api/api.service';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss'],
})
export class DemoComponent implements OnInit {
  @Input() exampleInput: string;
  @Output() exampleOutput = new EventEmitter<string>();

  // Dependency Injection: Die "DemoComponent" fordert den "ApiService" an, welcher den Zugriff auf die API bereitstellt
  constructor(private api: ApiService) {}

  ngOnInit(): void {}

  // Diese Methode ist mit "async" gekennzeichnet, da sie asynchrone Operationen ausführt (das Abfragen der Daten von der API)
  async onButtonClick() {
    // Anfrage an die API ausführen und auf das Ergebnis warten (await)
    const apiResult = await this.api.doRequest();
    this.exampleOutput.emit(JSON.stringify(apiResult));
  }
}
