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
  private isVisualizing: boolean = false;
  constructor() {}

  public get IsVisualizing() {
    return this.isVisualizing;
  }

  public set setVisualizing(isVisualizing : boolean) {
    this.isVisualizing = isVisualizing;
  }

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
