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
  boardUpdating = false;

  onStartNewGame() {
    this.boardUpdating = true;
    const message = {
      action: 'resetBoard'
    }
    const url = window.location.href
    const originPrefix = url.slice(0, url.lastIndexOf('/'))
    postMessage(JSON.stringify(message), originPrefix.concat('/mainpage'))
    this.boardUpdating = false;
  }

  processBoardUpdating(event : MessageEvent) {
    if (this.boardUpdating) {
      // Board is already updating
      return;
    }

    const url = window.location.href
    const originPrefix = url.slice(0, url.lastIndexOf('/'))
    if (event.origin.startsWith(originPrefix)) {
      const data = JSON.parse(event.data);
      this.boardUpdating = true;
      let message = {
        action: 'moveRecieved',
        pgn: data.pgn
      }
      postMessage(JSON.stringify(message), originPrefix.concat('/mainpage'))
    }
  }

  processCompleted() {
    this.boardUpdating = false;
  }

  constructor() {
    window.addEventListener(
      "message",
      (event : MessageEvent) => {
        const data = JSON.parse(event.data);
        if (data.action == 'completed') {
          this.processCompleted()
        } else if (data.action == 'boardUpdating') {
          this.processBoardUpdating(event);
        }
      }
    );
  }
  
}
