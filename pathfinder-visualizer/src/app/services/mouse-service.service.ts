import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export enum MouseState {
  DOWN = 0,
  UP = 1,
}

export enum Item {
  WALL = 0,
  START = 1,
  TARGET = 2,
  CLEAR = 3,
}

@Injectable({
  providedIn: 'root'
})
export class MouseService {
  mouseState: BehaviorSubject<MouseState> = new BehaviorSubject<MouseState>(MouseState.UP);
  itemState: BehaviorSubject<Item> = new BehaviorSubject<Item>(Item.WALL);

  constructor() { }

  mouseDown(): void {
    this.mouseState.next(MouseState.DOWN);
  }

  mouseUp(): void {
    this.mouseState.next(MouseState.UP);
  }

  addBlockItemState(): void {
    this.itemState.next(Item.WALL);
  }

  addUnblockItemState(): void {
    this.itemState.next(Item.CLEAR);
  }

  addStartItemState(): void {
    this.itemState.next(Item.START);
  }

  addTargetItemState(): void {
    this.itemState.next(Item.TARGET);
  }
}
