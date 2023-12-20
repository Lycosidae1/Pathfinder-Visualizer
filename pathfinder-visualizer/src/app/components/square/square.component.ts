import { Component, OnInit, Input } from '@angular/core';
import { MouseService, MouseState } from '../../services/mouse-service.service';
import { BoardService, NodeSelection } from 'src/app/services/board.service';
import { Obstacles, START_POSITION_COLOR, TARGET_POSITION_COLOR, OBSTACLE_POSITION_COLOR, NEUTRAL_COLOR, SHORTEST_PATH_COLOR } from 'src/assets/constant';
import { GraphService } from 'src/app/services/graph.service';

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
  @Input() squareID!: string;

  constructor(private mouseService: MouseService, private boardService: BoardService, private graphService: GraphService){
    this.applyNeutralColor();
  };

  ngOnInit(): void {
    this.mouseService.mouseState.asObservable().subscribe((state) => {
      this.mouseState = state;
    });
    this.boardService.clearBoardEvent.asObservable().subscribe(() => {
      this.applyNeutralColor();
      this.boardService.unlockStartPosition();
      this.boardService.unlockTargetPosition();
    })
    this.boardService.clearObstaclesEvent.asObservable().subscribe(() => {
      if (Obstacles.includes(this.currentStyles['background-color'])) {
        this.applyNeutralColor();
      }
    })
    this.boardService.clearShortestPathEvent.asObservable().subscribe(() => {
      if (this.currentStyles['background-color'] == SHORTEST_PATH_COLOR) {
        this.applyNeutralColor();
        this.boardService.unlockStartPosition();
        this.boardService.unlockTargetPosition();
      }
    })
    this.boardService.nodeSelection.asObservable().subscribe((selection) => {
      this.nodeSelection = selection
    })
    this.boardService.startPositionIsSet.asObservable().subscribe((value) => {
      this.startPositionLocked = value;
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
    }
  }

  onClick(e:any): void {
    if(this.nodeSelection === NodeSelection.Obstacle) this.handleObstacle();
    else if(this.nodeSelection === NodeSelection.Start ) this.handleStartPosition();
    else if(this.nodeSelection === NodeSelection.Target ) this.handleTargetPosition();
  }

  start(): void {
    this.currentStyles = {
      'background-color': START_POSITION_COLOR,
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
      'background-color': OBSTACLE_POSITION_COLOR,
    }
  }

  applyNeutralColor(): void {
    this.currentStyles = {
      'background-color': NEUTRAL_COLOR,
    }
  }

  handleObstacle(): void {
    if(this.currentStyles['background-color'] === OBSTACLE_POSITION_COLOR) {
      this.applyNeutralColor();
      this.state = !this.state;
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
    else if(this.currentStyles['background-color'] === START_POSITION_COLOR){
      this.applyNeutralColor();
      this.boardService.unlockStartPosition();
    }  
  }

  handleTargetPosition(): void {
    if(!this.targetPositionLocked) {
      this.setTarget();
      this.boardService.lockTargetPosition();
    }

    else if (this.currentStyles['background-color'] === TARGET_POSITION_COLOR) {
      this.applyNeutralColor();
      this.boardService.unlockTargetPosition();
    }
  }

  setTarget(): void {
    this.currentStyles = {
      'background-color': TARGET_POSITION_COLOR,
    }
  }

  setShortestPath(): void {
    this.currentStyles = {
      'background-color': SHORTEST_PATH_COLOR,
    }
  }
}
