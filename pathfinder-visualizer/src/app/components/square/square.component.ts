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
    this.state = SquareState.CLEAR;
    this.applyNeutralColor();
  }

  handleSubscriptions(): void {
    this.mouseService.mouseState.asObservable().subscribe((state) => {
      this.mouseState = state;
    });
    this.boardService.clearBoardEvent.asObservable().subscribe(() => {
      this.applyNeutralColor();
    })
    this.boardService.clearObstaclesEvent.asObservable().subscribe(() => {
      if (this.state = SquareState.BLOCKED) {
        this.applyNeutralColor();
      }
    })
  }

  block(): void {
    if(this.mouseState == MouseState.DOWN) {
      this.state = SquareState.BLOCKED;
      this.applyBlackColor();
    }
  }

  onClick(): void {
    this.handleObstacle();
  }

  firstCase(): void {
    if(this.mouseState == MouseState.DOWN) {
      this.state = SquareState.START;
      this.applyBlackColor();
    }
  }

  startSelection(): void {
    this.mouseService.mouseDown();
  }

  endSelection(): void {
    this.mouseService.mouseUp();
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

  handleObstacle(): void {
    console.log(this.showArrow);
    console.log(this.showTarget);

    if(this.state = SquareState.BLOCKED) {
      this.applyNeutralColor();
    }
    else if (!this.showArrow && !this.showTarget){
      console.log("dooge")
      this.applyBlackColor();
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