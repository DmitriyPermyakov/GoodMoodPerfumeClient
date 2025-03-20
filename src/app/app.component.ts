import { Component, inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Location } from '@angular/common'

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


  constructor(private location: Location) {
    this.window = this.document.defaultView;
    this.tg = this.window.Telegram.WebApp;
  }

  ngOnInit(): void {
    this.tg.ready();
    this.tg.setHeaderColor("#AA60C8");
    this.tg.BackButton.onClick(() => { 
      if(window.history.length > 1) {
        console.log('before back', window.history.length)
        this.location.back()
        console.log('after back', window.history.length)
      }
      else {
        console.log("before close", window.history.length)
        this.tg.close()

      }
    })
    this.tg.MainButton.setParams({
      color: "#AA60C8",
      has_shine_effect: true
    })
    this.tg.MainButton.show();
    this.tg.BackButton.show();
  }

}
