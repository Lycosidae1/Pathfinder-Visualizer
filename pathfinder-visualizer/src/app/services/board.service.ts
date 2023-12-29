import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export enum NodeSelection {
  Start = 0,
  Obstacle = 1,
  Target = 2
}

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  clearBoardEvent: Subject<undefined> = new Subject();
  clearObstaclesEvent: Subject<undefined> = new Subject();
  clearShortestPathEvent: Subject<undefined> = new Subject();
  constructor() {   }

  clearBoard(): void {
    this.clearBoardEvent.next(undefined);
  }

  clearObstacles(): void {
    this.clearObstaclesEvent.next(undefined);
  }

  clearShortestPath() {
    this.clearShortestPathEvent.next(undefined);
  }
}
