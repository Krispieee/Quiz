import { Component, OnInit, AfterViewInit, QueryList, ViewChildren, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CreationService } from '../services/creation.service';
import { Question } from '../shared/models/question';
import { FormBuilder, FormArray, FormGroup, FormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-play-quiz',
  templateUrl: './play-quiz.component.html',
  styleUrls: ['./play-quiz.component.scss']
})
export class PlayQuizComponent implements OnInit {
  id:string
  password:string;
  nameEntered:boolean = false
  checked:boolean;
  questions:any[]
  currentPage:number;
  pageOfItem:Array<any>
  showPassword: boolean;
  showLoader:boolean;
  response:any;
  form = this._formBuilder.group({
    questions:  this._formBuilder.array([])
  })

  quizData={}
  @Input('nameEvent') nameEvent;

  constructor(public router:ActivatedRoute,public creationService:CreationService,public _formBuilder:FormBuilder,public navRouter:Router,public _messages:MessageService) { }

  ngOnInit(): void {
    // Get NavigationStart events
    
    let canProceed:boolean = false;
    this.router.paramMap.subscribe((params:ParamMap) => {
      this.id=params.get('id');
      this.password = params.get('password')
      this.creationService.GetQuiz(this.id).subscribe((res)=>{
        console.log(res)
        console.log(this.password)
        this.quizData['quiz_id']=res['quiz_id']
        this.quizData['password']=res['password']
        this.response = res
        if(res['password']){
          if(this.password){
            if(this.password === res['password']){
              canProceed = true
            }
          }else{
            this.showPassword = true
          }
        }else{
          canProceed = true
        }
        if(canProceed){
          this.proceed()
        }
          //console.log(this.questions)
    
    
      })
    });
  }
  ngAfterViewInit(){
    
  }
  onChangePage(pages: Object) {
    // update current page of items
    this.pageOfItem = pages['pageOfItem'];
    this.currentPage = pages['currentPage']-1;
}
get questionGroup(){
  return this.form.get('questions') as FormArray
}
checkPassword(value){
  if (this.quizData['password'] === value){
    this.showPassword=false
    this.proceed()
  }
}
setName(value){
  this.nameEntered=true
  this.quizData['player']=value
}
proceed(){
  let res=this.response['questions']
  res.forEach((element,index) => {
      res[index]=new Question().deseiralize(element)
      console.log(res)
      let questionGroup = this.form.get('questions') as FormArray 
      console.log(questionGroup)
      questionGroup.push(this.createOptionsGroup(element.option,element.answer))
    });
    this.questions=res as Array<any>
}
onSubmit(form){
  let total=0
  this.showLoader = true
  let correctAnswer=true
  let formValue=form.value['questions']
  for(let ques=0;ques<formValue.length;ques++){
    let answeredAnswer=[]
    
    if(this.questions[ques]['answer'].length>1 ){
      for(let opt=0;opt<formValue[ques]['proposedAnswer'].length;opt++){
        if(formValue[ques]['proposedAnswer'][opt]){
          console.log(formValue[ques]['proposedAnswer'][opt])
          answeredAnswer.push(this.questions[ques]['option'][opt])
        }
      }
    }else{
      answeredAnswer.push(formValue[ques]['proposedAnswer']) 
    }
    
    if (this.isSubset(this.questions[ques]['answer'],answeredAnswer)){
        total+=1
        correctAnswer=true
      
    }
    
  }
  this.quizData['score']= total
  this.quizData['no_of_ques']= `${formValue.length}` 
  console.log(this.quizData)
  this.creationService.submitQuiz(this.quizData).subscribe(res=>{
    console.log(res['message'])
    this.showLoader = false
    this.navRouter.navigate(['feedback',this.quizData['quiz_id']])
  },
  err=>{
    this.showLoader = false
    this._messages.add({severity:"error",summary:"Something went wrong"})
  })
}

isSubset(answer:any[],options:any[]){
  //console.log(answer,options)
  
  if(answer.length < options.length){
    return false
  }
  
  let count=0
  options.forEach(element => {
    if(answer.includes(element)){
      count++
    }
  })
  if(count===answer.length){
    return true
  }
  return false
}

createOptionsGroup(option,answeR){
  if(answeR.length>1){
    let group = this._formBuilder.group({
      proposedAnswer:this._formBuilder.array([])
    })
    let answer = group.get('proposedAnswer') as FormArray
    for(let i=0;i<option.length;i++){
      answer.push(this._formBuilder.control({value:false,disabled:false}))
    }
    return group
  }
  else if(answeR.length===1){
    let group = this._formBuilder.group({
      proposedAnswer:['']
    })  
      return group
  }
}
isRadio(index){
  return this.questions[index]['answer'].length===1 ? true : false
}

}
