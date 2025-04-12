import { Component, OnInit } from '@angular/core';
import { TelegramService } from './services/telegram.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'GoodMoodPerfumeFront';
  isDesktop: boolean = false

  constructor(private location: Location, 
    private tgService: TelegramService,
  ) {  }

  ngOnInit(): void {
    if(this.tgService.client === 'tdesktop')
      this.isDesktop = true
    this.tgService.backButton.onClick(() => { 
      if(window.history.length > 1) {
        this.location.back()
      }      
    })

    this.tgService.backButton.hide();   
   
  }

}
