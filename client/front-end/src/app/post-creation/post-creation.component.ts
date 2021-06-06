import { Component, OnInit } from '@angular/core';
import { Router, ParamMap, ActivatedRoute } from '@angular/router'
import { Clipboard } from '@angular/cdk/clipboard';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-post-creation',
  templateUrl: './post-creation.component.html',
  styleUrls: ['./post-creation.component.scss']
})
export class PostCreationComponent implements OnInit {
  
  constructor(public router:ActivatedRoute,public _messages: MessageService) { }
  
  url:string = "http://localhost:4200/play-quiz/"
  ngOnInit(): void {
    this.router.paramMap.subscribe((params:ParamMap) => {
      let id=params.get('id')
      this.url+=id
      if (params.get('password')){
        let password = params.get('password');
        this.url+="/"+password
      }
      
    });
  }
  copyToClipboard(){
    this._messages.add({severity:"success",summary:"Copied to clipboard"})
  }

}
