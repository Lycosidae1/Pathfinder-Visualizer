import { AfterViewInit, Component, QueryList, ViewChildren } from '@angular/core';
import * as DIMENSION from 'src/assets/constant';
import { BoardService } from './services/board.service';
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
  selectedAlgorithm: string = "Dijkstra";
  faArrow = faPlay;
  faTarget = faBullseye;
  algorithmOptions = AlgorithmOptions;
  
  constructor(private boardService: BoardService, 
    private graphService: GraphService,
    private toastr: ToastrService) {}

  ngAfterViewInit(): void {
    this.setAllSquares();
  }

  onAlgorithmMenuClick(algorithmSelected: string): void {
    this.selectedAlgorithm = algorithmSelected;
  }

  setAllSquares(): void {
    this.graphService.setGridSquares = this.child;
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

  onPreviousEvent(event: any): void {
    console.log("Event: ", event);
    if (event.eventType == "start") {
      this.setPreviouStart(event.squareID);
    }

    else if (event.eventType == "target") {
      this.setPreviouTarget(event.squareID);
    }
  }

  setPreviouStart(previousSquareID: string): void {
    this.child.find(currentSquare => currentSquare.squareID == previousSquareID)?.changeStartPosition();
  }

  setPreviouTarget(previousSquareID: string): void {
    this.child.find(currentSquare => currentSquare.squareID == previousSquareID)?.changeTargetPosition();
  }
}
