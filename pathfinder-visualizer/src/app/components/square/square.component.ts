import { Item, MouseService, MouseState } from '../../services/mouse-service.service';
import { BoardService, NodeSelection } from 'src/app/services/board.service';
import { Component, OnInit, Input } from '@angular/core';
import { Obstacles, SHORTEST_PATH_COLOR } from 'src/assets/constant';
import { faPlay, faBullseye } from '@fortawesome/free-solid-svg-icons';

enum SquareState {
  CLEAR = 0,
  BLOCKED = 1,
  START = 2,
  TARGET = 3,
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
  faArrow = faPlay;
  faTarget = faBullseye;
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
      this.free();
    })
    this.boardService.clearObstaclesEvent.asObservable().subscribe(() => {
      if (this.state = SquareState.BLOCKED) this.free();
    })
  }

  onMouseUp(): void {
    // console.log("Item MUP: ", this.item);
    // if(this.state == SquareState.START) {
    //   // this.changeStartPosition();
    //   this.mouseService.addBlockItemState();
    // }

    // if(this.item == Item.START) {
    //   this.changeStartPosition();
    //   this.state = SquareState.START;
    //   this.mouseService.addBlockItemState();
    // }
    // else if(this.state == SquareState.CLEAR) this.block();
    // else if(this.state = SquareState.BLOCKED) {
    //   if(this.mouseState == MouseState.UP) {  // You are not currently holding the mouse in order to add a wall.
    //     this.free();
    //   }
    // }
    console.log("---------MOUSEUP---------------")
    console.log("State: ", this.state);
    console.log("Item: ", this.item);
    console.log("ItemStateMouse: ", this.mouseService.itemState);
    console.log("------------------------")
    if(this.item == Item.START){
      this.state = SquareState.START;
      this.changeStartPosition();
      this.mouseService.addStartItemState()
    }
    if(this.item == Item.TARGET){
      this.state = SquareState.TARGET;
      this.changeTargetPosition();
      this.mouseService.addTargetItemState()
    }
    if(this.item == Item.WALL){
      this.mouseService.addBlockItemState()
      this.block();
    }
    this.mouseService.mouseUp();

  }

  onMouseDown(): void {
    

    if(this.state == SquareState.START) {
      this.mouseService.addStartItemState();
      this.changeStartPosition();
      this.state = SquareState.CLEAR;
    }
    else if(this.state == SquareState.TARGET) {
      // this.changeTargetPosition();
      this.mouseService.addTargetItemState();
      this.changeTargetPosition();
      this.state = SquareState.CLEAR;
    }
    else if (this.state == SquareState.CLEAR){
      this.mouseService.addBlockItemState();
      this.state = SquareState.BLOCKED;
    }
    else {
      this.mouseService.addUnblockItemState();
      this.state = SquareState.CLEAR;
    }
    this.mouseService.mouseDown();
    console.log("---------MOUSEDOWN---------------");
    console.log("State: ", this.state);
    console.log("Item: ", this.item);
    console.log("ItemStateMouse: ", this.mouseService.itemState);
    console.log("------------------------");
  }

  onMouseOver(): void {
    // console.log("---------MOUSEOVER---------------")
    // console.log("State: ", this.state);
    // console.log("Item: ", this.item);
    // console.log("ItemStateMouse: ", this.mouseService.itemState);
    // console.log("------------------------")
    // console.log("Item MOVER: ", this.item);
    if(this.mouseState == MouseState.DOWN) {
      if (this.item == Item.WALL) this.block();
    }
  }

  changeStartPosition(): void {
    this.showArrow = !this.showArrow;
  }
  changeTargetPosition(): void {
    this.showTarget = !this.showTarget;
  }

  block(): void {
    // console.log("Block()");
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
      'transition': 'width 0.5s'
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
    this.currentStyles = {
      'background-color': SHORTEST_PATH_COLOR,
    }
  }
}