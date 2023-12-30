import { Item, MouseService } from '../../services/mouse-service.service';
import { BoardService } from 'src/app/services/board.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SHORTEST_PATH_COLOR } from 'src/assets/constant';
import { first } from 'rxjs';

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
    this.boardService.clearBoardEvent.asObservable().subscribe(() => {
      if(this.showArrow){
        this.setStartSquare();
      }
      else if(this.showTarget){
        this.setTargetSquare();
      }
      else {
        this.setClearSquare();
      }
      this.removeVisitedClass();
    });
    this.boardService.clearObstaclesEvent.asObservable().subscribe(() => {
      if(this.squareState == SquareState.BLOCKED){
        this.setClearSquare();
      }
    });
    this.boardService.clearShortestPathEvent.asObservable().subscribe(() => {
      if(this.squareState == SquareState.SHORTESTPATH){    
        if(this.showArrow){
          this.setStartSquare();
        }
        else if(this.showTarget){
          this.setTargetSquare();
        }
        else {
          this.setClearSquare();
        }
        this.removeVisitedClass();
      }   
    });
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
        this.mouseService.setPreviousStart = this.squareID;
        break;
      }

      case SquareState.TARGET: {
        this.setClearSquare();
        this.changeTargetPosition();
        this.mouseService.setItemState = Item.TARGET;
        this.mouseService.setPreviousTarget = this.squareID;
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
        if(this.squareState == SquareState.TARGET) return;
        this.changeStartPosition();
        break;
      }

      case Item.TARGET: {
        if(this.squareState == SquareState.START) return;
        this.changeTargetPosition();
        break;
      }
    }  
  }

  onMouseLeave(): void {
    switch(this.mouseService.getItemState){
      case Item.START: {
        if(this.squareState == SquareState.TARGET) return;
        this.showArrow = false;
        this.squareState = SquareState.CLEAR;
        break;
      }
      case Item.TARGET: {
        if(this.squareState == SquareState.START) return;
        this.showTarget = false;
        this.squareState = SquareState.CLEAR;
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
    this.applyNeutralColor();
  }

  setTargetSquare(): void {
    this.squareState = SquareState.TARGET;
    this.applyNeutralColor();
  }

  setShortestPath(): void {
    this.squareState = SquareState.SHORTESTPATH;
    this.addVisitedClass();
  }

  applyShortestPathAnimation(currentDiff: number, height: number): void {
    this.removeVisitedClass();
    this.currentStyles = {
      'background-color': 'rgb(255, 254, 106)',
    }
      switch (currentDiff){
        case 1:
          document.getElementById(this.squareID)?.classList.add("showArrowDown");

          break;
        case -1:
          document.getElementById(this.squareID)?.classList.add("showArrowUp");
          break;
        case height:
          document.getElementById(this.squareID)?.classList.add("showArrowRight");
          break;
        case -height:
          document.getElementById(this.squareID)?.classList.add("showArrowLeft");
          break;
      }
  }

  hideArrowAnimation(): void {
    let arrowsToRemove = ["showArrowDown", "showArrowUp", "showArrowRight", "showArrowLeft"];
    for(let i = 0; i < arrowsToRemove.length; i++){
      document.getElementById(this.squareID)?.classList.remove(arrowsToRemove[i]);
    }
  }

  addVisitedClass(): void {
    document.getElementById(this.squareID)?.classList.add("visited");
  }

  removeVisitedClass(): void {
    document.getElementById(this.squareID)?.classList.remove("visited");
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