import { Item, MouseService } from '../../services/mouse-service.service';
import { BoardService } from 'src/app/services/board.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SHORTEST_PATH_COLOR } from 'src/assets/constant';

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
  @Output() setPreviousElement: EventEmitter<any> = new EventEmitter<any>();
  private squareState!: SquareState;
  currentStyles!: {[klass: string]: any; };
  showArrow = false;  
  showTarget = false;

  constructor(private mouseService: MouseService, private boardService: BoardService) {};

  ngOnInit(): void {
    this.handleSubscriptions();
    this.setClearSquare();
    if(this.squareID == "Square1523"){
      this.showArrow = true;
      this.squareState = SquareState.START;
    }
    if(this.squareID == "Square2523"){
      this.showTarget = true;
      this.squareState = SquareState.TARGET;
    }
  }

  handleSubscriptions(): void {
    //  TODO
  }

  onMouseDown(): void {
    switch(this.squareState){
      case SquareState.CLEAR: {
        this.setBlockSquare();
        this.mouseService.setItemState = Item.OBSTACLE;
        break;
      }

      case SquareState.BLOCKED: {
        this.setClearSquare();
        this.mouseService.setItemState = Item.NO_ACTION;
        break;
      }

      case SquareState.START: {
        this.setClearSquare();
        this.changeStartPosition();
        this.mouseService.setItemState = Item.START;
        // this.mouseService.setPreviousStart = this.squareID;
        break;
      }

      case SquareState.TARGET: {
        this.setClearSquare();
        this.changeTargetPosition();
        this.mouseService.setItemState = Item.TARGET;
        this.mouseService.setPreviousTarget = this.squareID;
        break;
      }

      case SquareState.SHORTESTPATH: {
        // TODO
        break;
      }
    }  
  }

  onMouseEnter(): void {
    switch(this.mouseService.getItemState){
      case Item.OBSTACLE: {
        if(this.squareState == SquareState.START || this.squareState == SquareState.TARGET) return;
        this.setBlockSquare();
        break;
      }

      case Item.START: {
        this.changeStartPosition();
        break;
      }

      case Item.TARGET: {
        this.changeTargetPosition();
        break;
      }
    }  
  }

  onMouseLeave(): void {
    switch(this.mouseService.getItemState){
      case Item.START: {
        this.changeStartPosition();
        break;
      }
      case Item.TARGET: {
        this.changeTargetPosition();
        break;
      }
    }  
  }

  onMouseUp(): void {
    switch(this.mouseService.getItemState){
      case Item.START: {
        if(this.squareState == SquareState.BLOCKED || this.squareState == SquareState.CLEAR) {
          this.setClearSquare()
          this.changeStartPosition();
        }
        else if(this.squareState == SquareState.TARGET) {
          this.setPreviousElement.emit( { eventType: "start", squareID: this.mouseService.getPreviousStart });
        }
        break;
      }

      case Item.TARGET: {
        if(this.squareState == SquareState.BLOCKED || this.squareState == SquareState.CLEAR) {
          this.setClearSquare()
          this.changeTargetPosition();
        }
        else if(this.squareState == SquareState.START) {
          this.setPreviousElement.emit( { eventType: "target", squareID: this.mouseService.getPreviousTarget });
        }
        break;
      }
    }  
    this.mouseService.setItemState = Item.NO_ACTION;
  }

  changeStartPosition(): void {
    this.showArrow = !this.showArrow;
    this.showArrow ? this.squareState = SquareState.START : this.squareState = SquareState.CLEAR;

  }
  changeTargetPosition(): void {
    this.showTarget = !this.showTarget;
    this.showTarget ? this.squareState = SquareState.TARGET : this.squareState = SquareState.CLEAR;
  }

  setBlockSquare(): void {
    this.squareState = SquareState.BLOCKED;
    this.applyBlackColor();
  }

  setClearSquare(): void {
    this.squareState = SquareState.CLEAR;
    this.applyNeutralColor();
  }

  setStartSquare(): void {
    this.squareState = SquareState.START;
    this.applyBlackColor();
  }

  setShortestPath(currentSquare: string): void {
    document.getElementById(currentSquare)?.classList.add("visited");
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
}