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

  constructor(private mouseService: MouseService, private boardService: BoardService){
    this.applyNeutralColor();
  };

  ngOnInit(): void {
    this.mouseService.mouseState.asObservable().subscribe((state) => {
      this.mouseState = state;
    });
    this.boardService.clearBoardEvent.asObservable().subscribe(() => {
      this.applyNeutralColor();
    })
    this.boardService.nodeSelection.asObservable().subscribe((selection) => {
      this.nodeSelection = selection
    })
    this.boardService.startPositionIsSet.asObservable().subscribe((value) => {
      this.startPositionLocked = value;
    })
  }

  block(): void {
    if(this.nodeSelection === NodeSelection.Obstacle) {
      if(this.mouseState == MouseState.DOWN) {
      this.applyColor();
      this.state = !this.state;
    }
    }

  }

  onClick(e:any): void {
    if(this.nodeSelection === NodeSelection.Obstacle) this.color();
    else if(this.nodeSelection === NodeSelection.Start && !this.startPositionLocked) {
      this.start(); 
      this.boardService.lockStartPosition();
    }   
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
        this.state = !this.state;
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
  }

  applyNeutralColor(): void {
    this.currentStyles = {
      'background-color': 'white',
    }
  }

  color(): void {
    if(this.currentStyles['background-color'] === 'black') {
      this.applyNeutralColor();
      this.state = !this.state;
    }
    else {
      this.applyColor();
    }
  }

}
