import { AfterViewInit, Component, QueryList, ViewChildren } from '@angular/core';
import * as DIMENSION from 'src/assets/constant';
import { BoardService, NodeSelection } from './services/board.service';
import { GraphService } from './services/graph.service';
import { SquareComponent } from './components/square/square.component';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { faBullseye } from '@fortawesome/free-solid-svg-icons';
import { AlgorithmOptions } from '../assets/constant'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChildren(SquareComponent) child!: QueryList<SquareComponent>;
  width = Array(DIMENSION.BORD_WIDTH);
  height = Array(DIMENSION.BORD_HEIGHT);
  value: boolean = false;
  selectedAlgorithm: string = "";
  selectedNode: NodeSelection = NodeSelection.Obstacle;
  NodeSelection = NodeSelection
  faArrow = faPlay;
  faTarget = faBullseye;
  algorithmOptions = AlgorithmOptions;


  constructor(private boardService: BoardService, 
    private graphService: GraphService,
    private toastr: ToastrService) {}

  ngAfterViewInit(): void {
    this.getAllSquares();
  }

  onAlgorithmMenuClick(algorithmSelected: string): void {
    this.selectedAlgorithm = algorithmSelected;
  }

  getAllSquares(): void {
    this.graphService.setGridSquares = this.child;
  }

  // modifyHeight(event: any): void {
  //   try {
  //     const newHeight = parseInt(event.target.value);
  //     if (newHeight > DIMENSION.MAX_HEIGHT) this.height = Array(DIMENSION.MAX_HEIGHT);
  //     else if (newHeight < DIMENSION.MIN_HEIGHT) this.height = Array(DIMENSION.MIN_HEIGHT);
  //     else this.height = Array(newHeight);
  //     this.getAllSquares();
  //     this.graphService.setHeight = newHeight;
  //   }
  //   catch(err) {
  //     this.height = Array(10);
  //   }
  // }

  // modifyWidth(event: any): void {
  //   try {
  //     const newWidth = parseInt(event.target.value);
  //     if (newWidth > DIMENSION.MAX_WIDTH) this.width = Array(DIMENSION.MAX_WIDTH);
  //     else if (newWidth < DIMENSION.MIN_WIDTH) this.width = Array(DIMENSION.MIN_WIDTH);
  //     else this.width = Array(newWidth);
  //     this.getAllSquares();
  //     this.graphService.setWidth = newWidth;
  //   }
  //   catch(err) {
  //     this.width = Array(20);
  //   }
  // }

  StartPositionSquareNumber(posX: number, posY: number): number {
    return posX * this.height.length + posY;
  }

  TargetPositionSquareNumber(posX: number, posY: number): number {
    return posX * this.height.length + posY;
  }


  clearBoard(): void {
    this.boardService.clearBoard();
  }

  clearObstacles(): void {
    this.boardService.clearObstacles();
  }

  clearShortestPath(): void {
    this.boardService.clearShortestPath();
  }

  Visualize(): void {
    this.selectedAlgorithm == "" ? this.toastr.error("You haven't selected an algorithm!") : this.graphService.visualize();
  }

  onNodeChange(): void {
    this.boardService.changeNodeSelection(this.selectedNode);
  }

  onAlgorithmChange(): void {

  }
}
