import { Injectable, QueryList } from '@angular/core';
import { SquareComponent } from '../components/square/square.component';
import * as CONSTANTS from 'src/assets/constant';
import { DijkstraCalculator } from 'D:/Projects/Pathfinder-Visualizer/dijkstra-calculator-master/dijkstra-calculator-master/src/index'
import { ToastrService } from 'ngx-toastr';
import { BoardService } from './board.service';

@Injectable({
  providedIn: 'root'
})

export class GraphService {
  private graph = new DijkstraCalculator();
  private width: number = CONSTANTS.BORD_WIDTH;
  private height: number = CONSTANTS.BORD_HEIGHT;
  private squares!: QueryList<SquareComponent>;
  private nodes: Array<string | undefined> = new Array<string | undefined>();
  
  constructor(private toastr: ToastrService, private boardService: BoardService) { 
  }

  public set setWidth(width : number) {
    this.width = width;
  }

  public set setHeight(height : number) {
    this.height = height;
  }

  public set setGridSquares(squares : QueryList<SquareComponent>) {
    this.squares = squares;
  }

  clearShortestPath(): void {
    this.boardService.clearShortestPath();
  }

  dijkstra(): void {
    this.updateVertices();
    this.visualizeDijkstra();
  }

  updateVertices(): void {
    // Adding The Vertices
    for(let i = 0; i < this.squares?.length; i++){
      if (this.squares.get(i)?.currentStyles['background-color'] != CONSTANTS.OBSTACLE_POSITION_COLOR){
        this.graph.addVertex('Square' + i.toString());
      } 
    }

    // Adding a connection between two squares situated one above the other
    for(let i = 0; i < this.width; i++){
      for(let j = 0; j < this.height - 1; j++){
        if (this.squares.get(j + i * this.height)?.currentStyles['background-color'] != CONSTANTS.OBSTACLE_POSITION_COLOR
        && this.squares.get((j + 1) + i * this.height)?.currentStyles['background-color'] != CONSTANTS.OBSTACLE_POSITION_COLOR){
          this.graph.addEdge("Square" + (j + i * this.height).toString(), "Square" + ((j + 1) + i * this.height).toString());
        }
      }
    }

    // Adding connections between a square and the squares on the left and the right
    for(let i = 0; i < this.width - 1; i++){
      for(let j = 0; j < this.height; j++){
        if (this.squares.get(j + i * this.height)?.currentStyles['background-color'] != CONSTANTS.OBSTACLE_POSITION_COLOR 
        && this.squares.get((j + this.height) + i * this.height)?.currentStyles['background-color'] != CONSTANTS.OBSTACLE_POSITION_COLOR){
          this.graph.addEdge("Square" + (j + i * this.height).toString(), "Square" + ((j + this.height) + i * this.height).toString());
        }
      }
    }
  }

  async visualizeDijkstra(): Promise<void> {
    this.clearShortestPath();
    this.graph = new DijkstraCalculator();
    this.updateVertices();

    this.graph.adjencyListBehavior.asObservable().subscribe((nodeList: Array<string | undefined>) => {
      this.nodes = nodeList;
    })


    let startPosition = this.squares.find(currentSquare => currentSquare.showArrow)?.squareID;
    let targetPosition = this.squares.find(currentSquare => currentSquare.showTarget)?.squareID;

    if (startPosition == undefined) startPosition = "Square0";
    if (targetPosition == undefined) targetPosition = "Square1";

    let shortestPath = this.graph.calculateShortestPath(startPosition, targetPosition)
    if (shortestPath.length == 0) this.toastr.info("There are no paths available");
    

    for(let i = 0; i < this.nodes.length; i++){
      this.squares.find(currentSquare => currentSquare.squareID == this.nodes[i])?.setShortestPath();
      await CONSTANTS.delay(0);
    }

    let squares = [];
    for(let i = 0; i < shortestPath.length; i++){
      squares.push(this.squares.find(currentSquare => currentSquare.squareID == shortestPath[i]));
    }

    let currentSquareID: number = 0;
    let nextSquareID: number = 0;
    let currentDiff = 0;
    for(let i = 0; i < shortestPath.length; i++){
      if(i != shortestPath.length - 1){    
        currentSquareID = parseInt(squares[i]!.squareID.slice(6));
        nextSquareID = parseInt(squares[i + 1]!.squareID.slice(6));
        currentDiff = nextSquareID - currentSquareID;   
        squares[i]?.applyShortestPathAnimation(currentDiff, this.height);
        await CONSTANTS.delay(50);
        if(i==0) continue  
        squares[i]?.hideArrowAnimation();

      }
      else {
        squares[i]?.applyShortestPathAnimation(currentDiff, this.height);
        await CONSTANTS.delay(50);

        squares[i]?.hideArrowAnimation();
      }
    }
    this.boardService.setVisualizing = false;
  }

  visualizeAStar(): void {
    this.clearShortestPath();
    
  }
}
