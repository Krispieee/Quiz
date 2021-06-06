import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthServiceService } from '../services/auth-service.service';
import { CreationService } from '../services/creation.service';
import { ConfirmEmailValidator } from '../shared/customValidators/customEmailPassword';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  errors:string
  forgotPassword:boolean=false
  showLoader:boolean;
  constructor(public _formBuilder:FormBuilder,public _authService:AuthServiceService,public _router:Router, public _messages: MessageService) { }
  ngOnInit(): void {
  }
  
  onSubmit(value){ 
    this.showLoader = true
    this._authService.login(value).subscribe((res)=>{
      console.log(res)
      this.showLoader = false
      localStorage.setItem('token',res.access_token)
      localStorage.setItem('creater_email',res.creater_email)
      this._router.navigate(['/profile'])
      this._messages.add({severity:"success",summary:"Logged In Successfully"})
    },
    err=>{
      this.showLoader = false
      this._messages.clear()
      this._messages.add({severity:"error",summary:"Username or Password is incorrect"})
      console.log(err) 
      this.errors=err.error.message
    }
    )
  }

}
