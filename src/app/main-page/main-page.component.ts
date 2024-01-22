import { Component, ViewChild } from '@angular/core';
import { IFramePageComponent } from "../iframe-page/iframe-page.component";

@Component({
    selector: 'app-main-page',
    standalone: true,
    templateUrl: './main-page.component.html',
    styleUrl: './main-page.component.scss',
    imports: [IFramePageComponent]
})
export class MainPageComponent {

  onStartNewGame() {
    const message = {
      action: 'resetBoard'
    }
    const url = window.location.href
    const originPrefix = url.slice(0, url.lastIndexOf('/'))
    postMessage(JSON.stringify(message), originPrefix.concat('/mainpage'))
  }

  processBoardUpdating(event : MessageEvent) {
    const url = window.location.href
    const originPrefix = url.slice(0, url.lastIndexOf('/'))
    if (event.origin.startsWith(originPrefix)) {
      const data = JSON.parse(event.data);
      let message = {
        action: 'moveRecieved',
        pgn: data.pgn
      }
      postMessage(JSON.stringify(message), originPrefix.concat('/mainpage'))
    }
  }

  constructor() {
    window.addEventListener(
      "message",
      (event : MessageEvent) => {
        const data = JSON.parse(event.data);
        if (data.action == 'boardUpdating') {
          this.processBoardUpdating(event);
        }
      }
    );
  }
  
}
