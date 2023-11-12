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
  nodeSelection: BehaviorSubject<NodeSelection> = new BehaviorSubject<NodeSelection>(NodeSelection.Obstacle)
  startPositionIsSet: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor() { }

  clearBoard(): void {
    this.clearBoardEvent.next(undefined);
  }

  changeNodeSelection(selection: NodeSelection): void {
    this.nodeSelection.next(selection);
  }

  lockStartPosition(): void {
    this.startPositionIsSet.next(true);
  }

  unlockStartPosition(): void {
    this.startPositionIsSet.next(false);
  }
}
