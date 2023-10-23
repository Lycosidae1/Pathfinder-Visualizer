import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as DIMENSION from '../assets/constant';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pathfinder-visualizer';
  width = Array(DIMENSION.BORD_WIDTH);
  height = Array(DIMENSION.BORD_HEIGHT);
  value: boolean = false;

  increaseHeight(): void {
    if (this.height.length + 1 <= DIMENSION.MAX_HEIGHT)
      this.height = Array(this.height.length + 1);
  }

  decreaseHeight(): void {
    if (this.height.length - 1 >= DIMENSION.MIN_HEIGHT)
      this.height = Array(this.height.length - 1);
  }

  increaseWidth(): void {
    if (this.width.length + 1 <= DIMENSION.MAX_WIDTH)
      this.width = Array(this.width.length + 1);
  }

  decreaseWidth(): void {
    if (this.width.length - 1 >= DIMENSION.MIN_WIDTH)
      this.width = Array(this.width.length - 1);
  }
}
