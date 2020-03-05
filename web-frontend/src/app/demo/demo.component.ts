import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss'],
})
export class DemoComponent implements OnInit {
  @Input() exampleInput: string;
  @Output() exampleOutput = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}

  onButtonClick() {
    this.exampleOutput.emit('Der Button wurde geklickt');
  }
}
