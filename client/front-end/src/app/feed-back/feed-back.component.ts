import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CreationService } from '../services/creation.service';

@Component({
  selector: 'app-feed-back',
  templateUrl: './feed-back.component.html',
  styleUrls: ['./feed-back.component.scss']
})
export class FeedBackComponent implements OnInit {
  quiz_id;
  showLoader:boolean;
  constructor(public _creationService:CreationService,public _router:Router,public _activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe((params:ParamMap)=>{
      this.quiz_id = params.get('quiz_id')
    })
  }

  getQuiz(){
    return this.quiz_id
  }
  onSubmit(value){
   this.showLoader = true
   this._creationService.giveFeedback(value).subscribe(res=>{
    this.showLoader = false 
    console.log(res)
     if(this.quiz_id){
       this._router.navigate(['results',this.quiz_id])
     }else{
       this._router.navigate(['home'])
     }
   }) 
  }
}
