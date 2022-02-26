import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CreationService } from '../services/creation.service';

import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(public _creationService: CreationService, public _router: Router, public _messages: MessageService, public _confirmationService: ConfirmationService) { }
  profileDetails: []
  username: string
  confirmPopup: boolean;
  showLoader:boolean;
  profilePic:any;
  ngOnInit(): void {
    this.getProfileDetails();
    
  }
  getBgColor(index) {
    let bg_colors = ['#66BB6A', '#AFB42B', '#1976D2', '#263238']


    return bg_colors[index % bg_colors.length]
  }
  getShadeColor(index) {
    let bg_shades = ['#A5D6A7', '#DCE775', '#64B5F6', '#90A4AE']
    return bg_shades[index % bg_shades.length]

  }

  confirmDelete(event: Event, id:number) {
    this._confirmationService.confirm({
      target: event.target,
      message: 'Are you sure that you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        //confirm action
        this.showLoader = true
        this._creationService.deleteQuiz({"id":id}).subscribe(res => {
          // this.getProfileDetails()
          let index = this.profileDetails.findIndex((obj:{id:number}) =>  obj.id == id);
          this.profileDetails.splice(index, index+1);
          this.showLoader = false;

        })

      },
      reject: () => {
        //reject action
      }
    });
  }

  getProfileDetails(){
    this.showLoader = true;
    this._creationService.getProfileDetails().subscribe(res => {
      this.profileDetails = res['profile']['quiz']
      this.username = res['profile']['user']['username']
      this.profilePic = 'data:image/jpeg;base64,' + res['profile']['user']['profilePic'];
      console.log(this.profileDetails)
      this.showLoader = false;
    }, (err: HttpErrorResponse) => {
      if (err.status == 200) {
        this.profileDetails = err['profile']['quiz']
      } else if (err.status > 400) {
        this._router.navigate(['/login'])
      }
      this.showLoader = false;

    })
  }

}
