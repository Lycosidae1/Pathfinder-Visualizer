import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { MouseService, MouseState } from '../../services/mouse-service.service';
import { BoardService, NodeSelection } from 'src/app/services/board.service';

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
    });
    this.boardService.nodeSelection.asObservable().subscribe((selection) => {
      this.nodeSelection = selection
    });
    this.boardService.startPositionIsSet.asObservable().subscribe((value) => {
      this.startPositionLocked = value;
    });
  }

  block(): void {
    if(this.nodeSelection === NodeSelection.Obstacle && this.mouseState === MouseState.DOWN) {
      this.applyColor();
    }
  }

  onClick(): void {
    if(this.nodeSelection === NodeSelection.Obstacle) this.handleObstacle();
    else if(this.nodeSelection === NodeSelection.Start) this.handleStartPosition();
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

}
