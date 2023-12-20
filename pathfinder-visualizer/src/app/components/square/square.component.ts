import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { MouseService, MouseState } from '../../services/mouse-service.service';
import { BoardService, NodeSelection } from 'src/app/services/board.service';
import { Obstacles } from 'src/assets/constant';

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.css']
})
export class SquareComponent implements OnInit {
  private state!: boolean;
  private mouseState!: MouseState;
  private nodeSelection!: NodeSelection;
  private startPositionLocked!: boolean
  private targetPositionLocked!: boolean
  currentStyles!: {[klass: string]: any; };

  constructor(private mouseService: MouseService, private boardService: BoardService) {};

  ngOnInit(): void {
    this.handleSubscriptions();
    this.applyNeutralColor();
  }

  handleSubscriptions(): void {
    this.mouseService.mouseState.asObservable().subscribe((state) => {
      this.mouseState = state;
    });
    this.boardService.clearBoardEvent.asObservable().subscribe(() => {
      this.applyNeutralColor();
      this.boardService.unlockStartPosition();
<<<<<<< HEAD
    });
=======
      this.boardService.unlockTargetPosition();
    })
    this.boardService.clearObstaclesEvent.asObservable().subscribe(() => {
      if (Obstacles.includes(this.currentStyles['background-color'])) {
        this.applyNeutralColor();
      }
    })
>>>>>>> 7b99b6a81e6ea2df4c540509b092335e27a3b7f9
    this.boardService.nodeSelection.asObservable().subscribe((selection) => {
      this.nodeSelection = selection
    });
    this.boardService.startPositionIsSet.asObservable().subscribe((value) => {
      this.startPositionLocked = value;
<<<<<<< HEAD
    });
  }

  block(): void {
    if(this.nodeSelection === NodeSelection.Obstacle && this.mouseState === MouseState.DOWN) {
      this.applyColor();
=======
    })
    this.boardService.targetPositionIsSet.asObservable().subscribe((value) => {
      this.targetPositionLocked = value;
    })
  }

  block(): void {
    if(this.nodeSelection === NodeSelection.Obstacle) {
        if(this.mouseState == MouseState.DOWN) {
        this.applyColor();
        this.state = !this.state;
      }
>>>>>>> 7b99b6a81e6ea2df4c540509b092335e27a3b7f9
    }
  }

  onClick(): void {
    if(this.nodeSelection === NodeSelection.Obstacle) this.handleObstacle();
<<<<<<< HEAD
    else if(this.nodeSelection === NodeSelection.Start) this.handleStartPosition();
=======
    else if(this.nodeSelection === NodeSelection.Start ) this.handleStartPosition();
    else if(this.nodeSelection === NodeSelection.Target ) this.handleTargetPosition();
>>>>>>> 7b99b6a81e6ea2df4c540509b092335e27a3b7f9
  }

  start(): void {
    this.currentStyles = {
      'background-color': 'green',
    }
  }

  firstCase(): void {
    if(this.nodeSelection === NodeSelection.Obstacle) {
      if(this.mouseState == MouseState.DOWN) {
        this.applyColor();
      }
    }
  }

  startSelection(): void {
    if(this.nodeSelection === NodeSelection.Obstacle)
      this.mouseService.mouseDown();
  }

  endSelection(): void {
    this.mouseService.mouseUp();
  }

  applyColor(): void {
    this.currentStyles = {
      'background-color': 'black',
    }
    this.state = !this.state;
  }

  applyNeutralColor(): void {
    this.currentStyles = {
      'background-color': 'white',
    }
    this.state= !this.state;
  }

  handleObstacle(): void {
    if(this.currentStyles['background-color'] === 'black') {
      this.applyNeutralColor();
    }
    else {
      this.applyColor();
    }
  }

  handleStartPosition(): void {
    if(!this.startPositionLocked) {
      this.start(); 
      this.boardService.lockStartPosition();
    }
    else if(this.currentStyles['background-color'] === 'green'){
      this.applyNeutralColor();
      this.boardService.unlockStartPosition();
    }  
  }

  handleTargetPosition(): void {
    if(!this.targetPositionLocked) {
      this.setTarget();
      this.boardService.lockTargetPosition();
    }

    else if (this.currentStyles['background-color'] === 'red') {
      this.applyNeutralColor();
      this.boardService.unlockTargetPosition();
    }
  }

  setTarget(): void {
    this.currentStyles = {
      'background-color': 'red',
    }
  }

}
