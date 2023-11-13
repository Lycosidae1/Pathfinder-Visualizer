import { Component, Input } from '@angular/core';
import * as DIMENSION from 'src/assets/constant';
import { BoardService, NodeSelection } from './services/board.service';

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
  selectedAlgorithm: string = "Dijkstra";
  selectedNode: NodeSelection = NodeSelection.Obstacle;
  NodeSelection = NodeSelection

  constructor(private boardService: BoardService) {

  }

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
  };

  decreaseWidth(): void {
    if (this.width.length - 1 >= DIMENSION.MIN_WIDTH)
      this.width = Array(this.width.length - 1);
  }

  clearBoard(): void {
    this.boardService.clearBoard();
  }

  clearObstacles(): void {
    this.boardService.clearObstacles();
  }

  Visualize(): void {
    
  }

  onNodeChange(): void {
    this.boardService.changeNodeSelection(this.selectedNode);
  }

  onAlgorithmChange(): void {

  }
}
