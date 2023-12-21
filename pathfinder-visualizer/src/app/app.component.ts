import { AfterViewInit, Component, QueryList, ViewChildren } from '@angular/core';
import * as DIMENSION from 'src/assets/constant';
import { BoardService, NodeSelection } from './services/board.service';
import { SquareComponent } from './components/square/square.component';
import { faPlay, faBullseye } from '@fortawesome/free-solid-svg-icons';
import { GraphService } from './services/graph.service';
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
    // this.graphService.initialPositions();
  }

  onAlgorithmMenuClick(algorithmSelected: string): void {
    this.selectedAlgorithm = algorithmSelected;
  }

  getAllSquares(): void {
    this.graphService.setGridSquares = this.child;
  }

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

  visualize(): void {
    this.selectedAlgorithm == "" ? this.toastr.error("You haven't selected an algorithm!") : this.graphService.visualize();
  }

  onNodeChange(): void {
    this.boardService.changeNodeSelection(this.selectedNode);
  }
}
