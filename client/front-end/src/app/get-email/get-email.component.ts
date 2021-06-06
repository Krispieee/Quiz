import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CreationService } from '../services/creation.service';
import { CustomValidators } from '../shared/customValidators/custom.validator';

@Component({
  selector: 'app-get-email',
  templateUrl: './get-email.component.html',
  styleUrls: ['./get-email.component.scss']
})
export class GetEmailComponent implements OnInit {
  @Output() cancel = new EventEmitter();
  passwordForm:FormGroup
  showLoader:boolean
  message:string 
  constructor(public _formBuilder:FormBuilder,public _creationService:CreationService,public _messages: MessageService) { }
  validEmails:string[]
  ngOnInit(): void {
    this.passwordForm=this._formBuilder.group({
      email : ['',{validators:[Validators.required,Validators.email],asyncValidators:[CustomValidators.createRequiredEmailValidator(this._creationService)]}]
    })
    this._creationService.GetEmails().subscribe(res=>{
      this.validEmails=res['emails']
    })
  }
  ngOnChanges(){
    console.log(this.email.errors)
  }
  get email(){
    return this.passwordForm.get('email')
  }
  onCancel(){
    this.cancel.emit("cancel")
  }
  sendMail(){
    this.showLoader = true
    this._creationService.sendEmail(this.passwordForm.value).subscribe(res=>{
      console.log(res)
      this.message=res['message']
    },
    (err:HttpErrorResponse)=>{
      if(err.status==200){
        this._messages.add({severity:"success",summary:"Check your mail for futher procedure",life:7000})
        this.showLoader = false
      }
    })
    
  }
  

}
