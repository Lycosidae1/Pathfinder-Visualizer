import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.css']
})
export class SquareComponent {
  @Input() hover?: boolean;
  @Output() eventItem = new EventEmitter<boolean>()
  blocked: boolean;
  currentStyles: {} = ''
  constructor(){
    this.blocked = false;
  };

  block(): void {
    this.blocked = !this.blocked;
    this.eventItem.emit(true);
  }

  over(): void {
    if(this.hover == true) {
      //elem.style.setProperty('background-color', 'lime');
      this.currentStyles = {
        'background-color': this.blocked ? 'black' : 'white',
      }
    }
  }

  done():void {
    this.eventItem.emit(false);
  }
}
