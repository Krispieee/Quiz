import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CreationService } from '../services/creation.service';
import { PasswordValidator } from '../shared/customValidators/customPasswordValidator';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  showLoader:boolean
  constructor(public _activatedRoute:ActivatedRoute,public _formBuilder:FormBuilder,public _creationService:CreationService,public _router: Router) { }
  passwordForm:FormGroup
  ngOnInit(): void {
    this.passwordForm=this._formBuilder.group({
      password : ['',[Validators.required,Validators.minLength(7),Validators.maxLength(16)]],
      confirm_password : ['',[Validators.required]]
    },{validators:PasswordValidator})

    this._activatedRoute.paramMap.subscribe((params:ParamMap)=>{
      let email = params.get('email')
      let token = params.get('token')
      sessionStorage.setItem('token',token)
      sessionStorage.setItem('creater_email',email)  
    })
  }
  get password(){
    return this.passwordForm.get('password') 
  } 
  get confirm_password(){
    return this.passwordForm.get('confirm_password') 
  }
  onSubmit(){
    this.passwordForm.value["email"]=sessionStorage.getItem('creater_email')
    this.showLoader = true
    this._creationService.updatePassword(this.passwordForm.value).subscribe(res=>{
      this.showLoader = false
      this._router.navigate(['/login'])      
    })    
  }

}
