import { Component, OnInit,EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-set-player',
  templateUrl: './set-player.component.html',
  styleUrls: ['./set-player.component.scss']
})
export class SetPlayerComponent implements OnInit {

  constructor(public _formBuilder:FormBuilder) { }
  @Input('type') type:string;
  @Input('textOnButton') textOnButton;
  @Input('hideImFine') hideImFine:boolean;
  
  @Input("preset")
  set preset(preset:string){
    this.field.setValue(preset)
  }
  form:FormGroup = this._formBuilder.group({
    field: ['',Validators.required]
  })
  @Output() setEvent = new EventEmitter()
  
  
  ngOnInit(): void {
    }
  get field(){
    //console.log("reached",this.field.value)
    return this.form.get('field') as FormControl
  }
  setField(){
    this.setEvent.emit(this.field.value)
  }
  isPassoword(){
    return this.type==="password" ?  true : false
  }

}
