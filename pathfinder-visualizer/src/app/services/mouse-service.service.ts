import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export enum MouseState {
  DOWN = 0,
  UP = 1,
}

@Injectable({
  providedIn: 'root'
})
export class MouseService {
  mouseState: BehaviorSubject<MouseState> = new BehaviorSubject<MouseState>(MouseState.UP);
  constructor() { }

  mouseDown(): void {
    this.mouseState.next(MouseState.DOWN);
  }

  mouseUp(): void {
    this.mouseState.next(MouseState.UP);
  }

}
