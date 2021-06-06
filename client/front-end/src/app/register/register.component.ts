import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CreationService } from '../services/creation.service';
import { CustomValidators } from '../shared/customValidators/custom.validator';
import { ForbiddenEmailValidator } from '../shared/customValidators/customEmailValidator';
import { PasswordValidator } from '../shared/customValidators/customPasswordValidator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  passwordVisible:boolean = false;  
  emails=[]
  registerForm : FormGroup = this._formBuilder.group({})
  showLoader:boolean;
  constructor(public _formBuilder:FormBuilder,public _creationService:CreationService,public _router:Router) { }
  ngOnInit(): void {
    this.registerForm = this._formBuilder.group({
      username : ['',Validators.required],
      //email : ['',[Validators.email,Validators.required],[CustomValidators.createForbiddenEmailValidator(this._creationService)]], 
      email : ['',{validators: [Validators.email,Validators.required],asyncValidators: [CustomValidators.createForbiddenEmailValidator(this._creationService)], updateOn :"blur"}], 
      password : ['',[Validators.required,Validators.minLength(7),Validators.maxLength(16)]],
      confirm_password : ['',[Validators.required]]
    },{validators:PasswordValidator}) 
    console.log(this.registerForm)
    // this._creationService.GetEmails().subscribe(res=>{
    //   console.log(res)
    //   this.emails = res['emails']
    //   this.setEmailValidators()
    // })
  }

  
  get username(){
    return this.registerForm.get('username')
  }
  get email(){
    return this.registerForm.get('email')
  }
  get password(){
    return this.registerForm.get('password') 
  } 
  get confirm_password(){
    return this.registerForm.get('confirm_password') 
  }

  setEmailValidators(){
    console.log(this.emails)
    this.email.setValidators(ForbiddenEmailValidator(this.emails))
  }
  onSubmit(){
    console.log(this.registerForm.value)
    this.showLoader = true
    this._creationService.CreateUser(this.registerForm.value).subscribe(res=>{
      this.showLoader = true
      this._router.navigate(['/login'])      
    })
  }
  test(){
    console.log(this.registerForm)
  }
  togglePasswordVisibility(){
    this.passwordVisible = !this.passwordVisible
  }
}
