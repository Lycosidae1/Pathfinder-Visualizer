import { Item, MouseService, MouseState } from '../../services/mouse-service.service';
import { BoardService } from 'src/app/services/board.service';
import { Component, OnInit, Input } from '@angular/core';
import { SHORTEST_PATH_COLOR } from 'src/assets/constant';
// import { faPlay, faBullseye } from '@fortawesome/free-solid-svg-icons';

enum SquareState {
  CLEAR = 0,
  BLOCKED = 1,
  START = 2,
  TARGET = 3,
  SHORTESTPATH = 4,
}

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.css']
})
export class SquareComponent implements OnInit {
  @Input() squareID!: string;
  private state!: SquareState;
  private mouseState!: MouseState;
  private item!: Item;
  currentStyles!: {[klass: string]: any; };
  showArrow = false;  
  showTarget = false;

  constructor(private mouseService: MouseService, private boardService: BoardService) {};

  ngOnInit(): void {
    this.handleSubscriptions();
    this.free();
    if(this.squareID == "Square1523"){
      this.showArrow = true;
      this.state = SquareState.START;
    }
    if(this.squareID == "Square2523"){
      this.showTarget = true;
      this.state = SquareState.TARGET;
    }
  }

  handleSubscriptions(): void {
    this.mouseService.mouseState.asObservable().subscribe((state) => {
      this.mouseState = state;
    });
    this.mouseService.itemState.asObservable().subscribe((item) => {
      this.item = item;
    });
    this.boardService.clearBoardEvent.asObservable().subscribe(() => {
      if(this.showArrow) this.reinitializeStart();
      else if (this.showTarget) this.reinitializeTarget();
      else this.free();
    })
    this.boardService.clearShortestPathEvent.asObservable().subscribe(() => {
      if (this.state == SquareState.SHORTESTPATH) 
      {
        if(this.showArrow) { 
          this.reinitializeStart();
        }
        else if (this.showTarget){
          this.reinitializeTarget();
        }
        else this.free();
      }
    })
    this.boardService.clearObstaclesEvent.asObservable().subscribe(() => {
      if (this.state == SquareState.BLOCKED) this.free();
      else if (this.showArrow) {
        this.reinitializeStart();
      }
      else if (this.showTarget) {
        this.reinitializeTarget();
      }
    })
  }

  onMouseUp(): void {
    if(this.item == Item.START){
      if(this.state == SquareState.TARGET) {
        // TODO
        return;
      }
      else {
        this.state = SquareState.START;
        this.changeStartPosition();
        this.mouseService.addStartItemState()
      }
      
    }
    else if(this.item == Item.TARGET){
      if(this.state == SquareState.START) return;
      else {
        this.state = SquareState.TARGET;
        this.changeTargetPosition();
        this.mouseService.addTargetItemState()
      }
      
    }
    else if(this.item == Item.WALL){
      this.mouseService.addBlockItemState()
      this.block();
    }
    else if(this.item == Item.CLEAR){
      this.free()
    }
    this.mouseService.mouseUp();
  }

  onMouseDown(): void {
    if(this.state == SquareState.START) {
      this.setStartPosition();
    }
    else if(this.state == SquareState.TARGET) {
      this.setTargetPosition();
    }
    else if (this.state == SquareState.CLEAR){
      this.setBlock();
    }
    else {
      this.setUnblock();
    }
    this.mouseService.mouseDown();
  }

  onMouseOver(): void {
    if(this.mouseState == MouseState.DOWN) {
      if(this.state == SquareState.START || this.state == SquareState.TARGET) return;
      else if (this.item == Item.WALL) this.block();
    }
  }

  reinitializeStart(): void {
    this.state = SquareState.START;
    this.applyNeutralColor();
  }

  reinitializeTarget(): void {
    this.state = SquareState.TARGET;
    this.applyNeutralColor();
  }

  setStartPosition(): void {
    this.mouseService.addStartItemState();
    this.changeStartPosition();
    this.state = SquareState.CLEAR;
  }

  setTargetPosition(): void {
    this.mouseService.addTargetItemState();
    this.changeTargetPosition();
    this.state = SquareState.CLEAR;
  }

  setBlock(): void {
    this.mouseService.addBlockItemState();
    this.state = SquareState.BLOCKED;
  }

  setUnblock(): void {
    this.mouseService.addUnblockItemState();
    this.state = SquareState.CLEAR;
  }

  changeStartPosition(): void {
    this.showArrow = !this.showArrow;
  }
  changeTargetPosition(): void {
    this.showTarget = !this.showTarget;
  }

  block(): void {
    this.state = SquareState.BLOCKED;
    this.applyBlackColor();
  }

  free(): void {
    this.state = SquareState.CLEAR;
    this.applyNeutralColor();
  }

  startSelection(): void {
    this.mouseService.mouseDown();
    this.block();
  }

  applyBlackColor(): void {
    this.currentStyles = {
      'background-color': 'black',
    }
  }

  applyNeutralColor(): void {
    this.currentStyles = {
      'background-color': 'white',
    }
  }

  handleStartPosition(): void {
    this.showArrow = !this.showArrow;
    this.state = SquareState.START;
  }

  handleTargetPosition(): void {
    this.showTarget = !this.showTarget;
    this.state = SquareState.TARGET;
  }

  setShortestPath(): void {
    this.state = SquareState.SHORTESTPATH;
    this.currentStyles = {
      'background-color': SHORTEST_PATH_COLOR,
    }
  }
}