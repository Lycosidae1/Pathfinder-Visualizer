import { Component, OnInit } from '@angular/core';
import { MouseService, MouseState } from '../mouse-service.service';

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.css']
})
export class SquareComponent implements OnInit {
  private state!: boolean;
  private mouseState!: MouseState;
  currentStyles!: {[klass: string]: any; };

  constructor(private mouseService: MouseService){
    this.applyNeutralColor();
  };

  ngOnInit(): void {
    this.mouseService.mouseState.asObservable().subscribe((state) => {
      this.mouseState = state;
    })
  }

  block(): void {
    if(this.mouseState == MouseState.DOWN) {
      this.applyColor();
      this.state = !this.state;
    }
  }

  removeSelection(e:any): void {
    console.log(e);
    if(this.currentStyles['background-color'] === 'black') {
      this.applyNeutralColor();
      this.state = !this.state;
    }
    else {
      this.applyColor();
    }
    
  }

  firstCase(): void {
    if(this.mouseState == MouseState.DOWN) {
      this.applyColor();
      this.state = !this.state;
    }
  }

  startSelection(): void {
    this.mouseService.mouseDown();
    //this.applyColor();
  }

  endSelection(): void {
    this.mouseService.mouseUp();
  }

  applyColor(): void {
    this.currentStyles = {
      'background-color': 'black',
    }
  }

  applyNeutralColor(): void {
    this.currentStyles = {
      'background-color': 'white',
    }
  }


}
