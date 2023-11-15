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

  modifyHeight(event: any): void {
    try {
      const newHeight = parseInt(event.target.value);
      if (newHeight > DIMENSION.MAX_HEIGHT) this.height = Array(DIMENSION.MAX_HEIGHT);
      else if (newHeight < DIMENSION.MIN_HEIGHT) this.height = Array(DIMENSION.MIN_HEIGHT);
      else this.height = Array(newHeight);
    }
    catch(err) {
      this.height = Array(10);
    }
    
  }

  modifyWidth(event: any): void {
    try {
      const newWidth = parseInt(event.target.value);
      if (newWidth > DIMENSION.MAX_WIDTH) this.width = Array(DIMENSION.MAX_WIDTH);
      else if (newWidth < DIMENSION.MIN_WIDTH) this.width = Array(DIMENSION.MIN_WIDTH);
      else this.width = Array(newWidth);
    }
    catch(err) {
      this.width = Array(20);
    }
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
