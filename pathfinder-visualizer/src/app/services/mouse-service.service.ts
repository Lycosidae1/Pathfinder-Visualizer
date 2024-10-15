import { Injectable } from '@angular/core';

export enum Item {
  OBSTACLE = 0,
  START = 1,
  TARGET = 2,
  NO_ACTION = 3,
}

@Injectable({
  providedIn: 'root'
})
export class MouseService {
  private itemState: Item = Item.NO_ACTION;
  private previousStart: string = "";
  private previousTarget: string = "";

  constructor() { }

  get getItemState(): Item {
    return this.itemState;
  }

  set setItemState(currentItem: Item) {
    this.itemState = currentItem;
  }

  get getPreviousStart(): string {
    return this.previousStart;
  }

  set setPreviousStart(currentStart: string) {
    this.previousStart = currentStart;
  }

  get getPreviousTarget(): string {
    return this.previousTarget;
  }

  set setPreviousTarget(currentTarget: string) {
    this.previousTarget = currentTarget;
  }
}
