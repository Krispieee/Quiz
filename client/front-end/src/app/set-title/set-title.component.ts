import { Component, OnInit,Output,EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-set-title',
  templateUrl: './set-title.component.html',
  styleUrls: ['./set-title.component.scss']
})
export class SetTitleComponent implements OnInit {
  @Output() setTitleEvent = new EventEmitter()
  @Input() quizTitle;
  constructor() { }
  
  ngOnInit(): void {
  }

  setTitle(){
    this.setTitleEvent.emit(this.quizTitle)

  }
  

}
