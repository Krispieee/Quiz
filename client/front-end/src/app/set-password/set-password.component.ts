import { Component, OnInit, Output,EventEmitter } from '@angular/core';


@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.scss']
})
export class SetPasswordComponent implements OnInit {
  passwordValid:boolean=false;
  constructor() { }
  @Output() setPasswordEvent = new EventEmitter()
  ngOnInit(): void {
  }
  validatePassword(value){
    value.length<6 ? this.passwordValid=false : this.passwordValid=true  
    }

  setPassword(value){
    this.setPasswordEvent.emit(value)
  }
}
