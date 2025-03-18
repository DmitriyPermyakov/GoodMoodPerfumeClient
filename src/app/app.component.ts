import { Component, inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'GoodMoodPerfumeFront';
  private tg;
  private window;
  private document = inject(DOCUMENT);


  constructor() {
    this.window = this.document.defaultView;
    this.tg = this.window.Telegram.WebApp;
  }

  ngOnInit(): void {
    this.tg.ready();
    this.tg.MainButton.show();
    this.tg.BackButton.show();
  }

}
