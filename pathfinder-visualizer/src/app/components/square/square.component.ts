import { MouseService, MouseState } from '../../services/mouse-service.service';
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
  currentStyles!: {[klass: string]: any; };
  faArrow = faPlay;
  faTarget = faBullseye;
  showArrow = false;  
  showTarget = false;

  constructor(private mouseService: MouseService, private boardService: BoardService) {};

  ngOnInit(): void {
    this.handleSubscriptions();
    this.free();
  }

  handleSubscriptions(): void {
    this.mouseService.mouseState.asObservable().subscribe((state) => {
      this.mouseState = state;
    });
    this.boardService.clearBoardEvent.asObservable().subscribe(() => {
      this.free();
    })
    this.boardService.clearObstaclesEvent.asObservable().subscribe(() => {
      if (this.state = SquareState.BLOCKED) this.free();
    })
  }

  onMouseUp(): void {
    if(this.state == SquareState.CLEAR) this.block();
    else if(this.state = SquareState.BLOCKED) {
      if(this.mouseState == MouseState.UP) {  // You are not currently holding the mouse in order to add a wall.
        this.free();
      }
    }
    this.mouseService.mouseUp();
  }

  onMouseDown(): void {
    if(this.state == SquareState.CLEAR) this.startSelection();
  }

  onMouseOver(): void {
    if(this.mouseState == MouseState.DOWN) this.block();
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
  }

  handleTargetPosition(): void {
    this.showTarget = !this.showTarget;
  }

  setShortestPath(): void {
    this.currentStyles = {
      'background-color': SHORTEST_PATH_COLOR,
    }
  }
}