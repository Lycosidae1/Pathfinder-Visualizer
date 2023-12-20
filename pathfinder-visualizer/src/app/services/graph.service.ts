import { Injectable, QueryList } from '@angular/core';
import { SquareComponent } from '../components/square/square.component';
import { BORD_HEIGHT, BORD_WIDTH, START_POSITION_COLOR, TARGET_POSITION_COLOR, OBSTACLE_POSITION_COLOR } from 'src/assets/constant';
import { DijkstraCalculator } from 'dijkstra-calculator';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})

export class GraphService {
  private graph = new DijkstraCalculator();
  private width: number = BORD_WIDTH;
  private height: number = BORD_HEIGHT;
  private squares!: QueryList<SquareComponent>;
  constructor(private toastr: ToastrService) { 
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

  updateVertices(): void {
    // Adding The Vertices
    for(let i = 0; i < this.squares?.length; i++){
      if (this.squares.get(i)?.currentStyles['background-color'] != OBSTACLE_POSITION_COLOR){
        this.graph.addVertex('Square' + i.toString());
      } 
    }

    // Adding a connection between two squares situated one above the other
    for(let i = 0; i < this.width; i++){
      for(let j = 0; j < this.height - 1; j++){
        if (this.squares.get(j + i * this.height)?.currentStyles['background-color'] != OBSTACLE_POSITION_COLOR
        && this.squares.get((j + 1) + i * this.height)?.currentStyles['background-color'] != OBSTACLE_POSITION_COLOR){
        // && this.squares.get((j - 1) + i * this.height)?.currentStyles['background-color'] != 'black'){
          this.graph.addEdge("Square" + (j + i * this.height).toString(), "Square" + ((j + 1) + i * this.height).toString());
        }
      }
    }

    // Adding connections between a square and the squares on the left and the right
    for(let i = 0; i < this.width - 1; i++){
      for(let j = 0; j < this.height; j++){
        if (this.squares.get(j + i * this.height)?.currentStyles['background-color'] != OBSTACLE_POSITION_COLOR 
        && this.squares.get((j + this.height) + i * this.height)?.currentStyles['background-color'] != OBSTACLE_POSITION_COLOR){
        // && this.squares.get((j - this.height) + i * this.height)?.currentStyles['background-color'] != 'black'){
          this.graph.addEdge("Square" + (j + i * this.height).toString(), "Square" + ((j + this.height) + i * this.height).toString());
        }
      }
    }
    console.log(this.graph.adjacencyList)
  }

  visualize(): void {
    this.graph = new DijkstraCalculator();
    this.updateVertices();
    let startPosition = this.squares.find(currentSquare => currentSquare.currentStyles['background-color'] == START_POSITION_COLOR)?.squareID;
    let targetPosition = this.squares.find(currentSquare => currentSquare.currentStyles['background-color'] == TARGET_POSITION_COLOR)?.squareID;
    if (startPosition == undefined) startPosition = "Square0";
    if (targetPosition == undefined) targetPosition = "Square1";
    let shortestPath = this.graph.calculateShortestPath(startPosition, targetPosition)
    if (shortestPath.length == 0) this.toastr.info("There are no paths available");
    for(let i = 0; i < shortestPath.length; i++){
      let square = this.squares.find(currentSquare => currentSquare.squareID == shortestPath[i])
      square?.setShortestPath()
    }
  }
}
