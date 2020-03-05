import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  inputValue = 'Ich werde in die DemoComponent hineingegeben';

  constructor() {}

  ngOnInit(): void {}

  onOutputTriggered(value: string) {
    alert('Der Output wurde ausgelöst. Daten: ' + value);
  }
}
