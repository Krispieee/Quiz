import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CreationService } from '../services/creation.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(public _creationService:CreationService,public _router:Router, public _messages: MessageService) { }
  profileDetails : []
  username:string
  ngOnInit(): void {
    
    this._creationService.getProfileDetails().subscribe(res=>{
      this.profileDetails=res['profile']['quiz']
      this.username=res['profile']['username']
      console.log(this.profileDetails)
    },(err:HttpErrorResponse)=>{
      if(err.status==200){
        this.profileDetails=err['profile']['quiz']
      }else if(err.status > 400){
        this._router.navigate(['/login'])
      }
    })
  }
  getBgColor(index){
    let bg_colors = ['#66BB6A','#AFB42B','#1976D2','#263238']
    
    
    return bg_colors[index % bg_colors.length]
  }
  getShadeColor(index){
    let bg_shades = ['#A5D6A7','#DCE775','#64B5F6','#90A4AE']
    return bg_shades[index % bg_shades.length]

  }

}
