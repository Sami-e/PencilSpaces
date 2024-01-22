import { Component, Input, ViewChild } from '@angular/core';
import { MoveChange, NgxChessBoardComponent, NgxChessBoardModule } from "ngx-chess-board"

@Component({
  selector: 'app-iframe-page',
  standalone: true,
  imports: [ NgxChessBoardModule ],
  templateUrl: './iframe-page.component.html',
  styleUrl: './iframe-page.component.scss'
})
export class IFramePageComponent {

  
  @Input()
  player: string = "";
  
  currentPlayer: string = 'white'
  propogateGameState: boolean = true

  @ViewChild('board', { static: false }) board!: NgxChessBoardComponent;

  getPlayerNumber() {
    return this.player == "white" ? 1 : 2;
  }
  
  getPlayerColour() {
    return this.player.charAt(0).toUpperCase() + this.player.slice(1);
  }

  orienteBoard() {
    if (this.player == 'black') {
      this.board.lightDisabled = true;
      this.board.reverse();
    } else {
      this.board.darkDisabled = true;
    }
  }

  resetBoard() {
    this.propogateGameState = false;
    this.currentPlayer = 'white'
    this.board.reset();
    this.propogateGameState = true;
  }

  onGameEnd(winner: number) {
    console.log("Checkmate", winner)
    let message: string = '';
    switch (winner) {
      case (1):
        message = "Checkmate! White has won!"
        break;
      case (0):
        message = "Stalemate!"
        break;
      case(-1):
        message = "Checkmate! Black has won"
        break;
    }
    window.alert(message);

  }

  onStalemate() {
    console.log("Stalemate!")
    this.onGameEnd(0);
  }
  onCheckmate() {
    console.log("Checkmate!")
    this.onGameEnd(this.currentPlayer == 'white' ? 1 : -1);
  }

  moveCallback($event: MoveChange) {    
    if (this.currentPlayer == this.player && this.propogateGameState) {
      this.propogateGameState = false;
      const message = {action: "boardUpdating", pgn: $event.pgn.pgn}
      const url = window.location.href
      const targetUrl = url.slice(0, url.lastIndexOf('/')).concat('/mainpage')
      console.log(message)
      postMessage(JSON.stringify(message), targetUrl)
      if ($event.checkmate) {
        this.onCheckmate()
      } else if ($event.stalemate) {
        this.onStalemate();
      }
    }
  }

  processMoveRecieved(data : {pgn: string}) {
    if (this.currentPlayer == this.player) {
      this.currentPlayer = this.currentPlayer == 'white' ? 'black' : 'white';
      this.propogateGameState = true;
      return;
    }

    this.board.setPGN(data.pgn);
    this.orienteBoard();
    this.currentPlayer = this.player;
    this.propogateGameState = true;
  }

  localSave(){
    const gameState = {
      currentPlayer: this.currentPlayer, 
      pgn: this.board.getPGN()
    }; 
    
    localStorage.setItem('boardState', JSON.stringify(gameState));
  }
 

  constructor() {
    window.addEventListener(
      "message",
      (event : MessageEvent) => {
        const url = window.location.href
        const originPrefix = url.slice(0, url.lastIndexOf('/'))
        if (!event.origin.startsWith(originPrefix)) {
          // Invalid Origin
          return;
        }

        const data = JSON.parse(event.data);
        if (data.action == 'moveRecieved') {
          this.processMoveRecieved(data)
        } else if (data.action == 'resetBoard') {
          this.propogateGameState = false;
          this.resetBoard();
          this.orienteBoard();
          this.propogateGameState = true;
        }
      }
    );

    window.onbeforeunload = this.localSave.bind(this);
  }

  ngAfterViewInit() {
    this.propogateGameState = false;
    const unparsedGameState = window.localStorage.getItem('boardState')
    if (unparsedGameState != null) {
      const gameState = JSON.parse(unparsedGameState);
      this.board.setPGN(gameState.pgn)
      this.currentPlayer = gameState.currentPlayer
    } else {
      this.resetBoard();
    }
    this.orienteBoard()
    
    this.propogateGameState = true;
  }
  
}
