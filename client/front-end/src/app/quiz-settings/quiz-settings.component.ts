import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Confirmation, ConfirmationService, MessageService } from 'primeng/api';
import { CreationService } from '../services/creation.service';
import { CustomValidators } from '../shared/customValidators/custom.validator';

@Component({
  selector: 'app-quiz-settings',
  templateUrl: './quiz-settings.component.html',
  styleUrls: ['./quiz-settings.component.scss']
})
export class QuizSettingsComponent implements OnInit {
  quizId;
  newQuestion: boolean = false;
  questions: any[] =[];
  currentQuestion: number = 0
  questionForm: FormGroup;
  optionsFull: boolean;
  enableRmBtn: boolean;
  canSetPassword: boolean;
  canSetTitle: boolean = false;
  something: string;
  questionSet = {
    title: '',
    creater_email: '',
    questions: []
  };
  disableNextButton: boolean;
  disablePreviousButton: boolean = true;
  title: any;
  showLoader:boolean;

  constructor(public _formBuilder: FormBuilder, public _creationService: CreationService, public _activatedRouter: ActivatedRoute, public _router: Router, public cdr: ChangeDetectorRef,public _confirmationService: ConfirmationService,public _messages:MessageService) { }

  ngOnInit(): void {

    this.questionForm = this._formBuilder.group({
      question: ['', [Validators.required]],
      options: this._formBuilder.array([

      ]),
    }, { validators: CustomValidators.AnswerValidator })
    //console.log(this.questionForm)
    this._activatedRouter.paramMap.subscribe((params: ParamMap) => {
      this.quizId = params.get('quiz_id')
      if (this.quizId) {
        this.showLoader = true;
        this._creationService.getDetailedQuiz(this.quizId).subscribe(res => {
          console.log(res)
          this.questions = res['questions']
          this.title = res['title']
          this.canSetTitle=true
          this.setQuestion(this.currentQuestion)
          console.log(this.questionForm)
          this.showLoader =  false;
        },
          err => {
            this.showLoader =  false;
          })
      }
    })

  }
  ngAfterViewChecked() {
    this.cdr.detectChanges()
  }

  get options() {
    return this.questionForm.get('options') as FormArray
  }
  get question() {
    return this.questionForm.get('question')
  }

  createOption() {
    return this._formBuilder.group({
      check: [{ value: false, disabled: false }],
      opt: [{ value: '', disabled: false }, [Validators.required]]
    })
  }

  setTitle(value) {
    this.title = value
    this.canSetTitle = false
  }
  addOption() {
    this.options.push(this.createOption())
    if (this.options.length > 2) {
      this.enableRmBtn = true
    }
    //console.log(this.options.length)
    if (this.options.length == 4) {

      this.optionsFull = true

    }
  }
  removeOption(index) {
    this.options.removeAt(index)
    if (this.options.length == 2) {
      this.enableRmBtn = false
    }
    if (this.options.length < 4) {
      this.optionsFull = false
    }
  }

  deleteQuestion(){
    this.questions[this.currentQuestion]["toBeDeleted"] = true
    console.log(this.questions[this.currentQuestion])
  }
  undoDeleteQuestion(){
    this.questions[this.currentQuestion]["toBeDeleted"] = false
  }
  
  onSubmit() {
    console.log("current question number"+this.currentQuestion)
    this.enableRmBtn=false
    this.optionsFull = false;
    console.log(this.currentQuestion , this.questions.length)
    let questionDataFromForm = this.getQuestionData()
    if(this.currentQuestion < this.questions.length){
      this.questions[this.currentQuestion]["question"] = questionDataFromForm["question"]
      this.setAnswers(questionDataFromForm)
      this.setOptions(questionDataFromForm)
    }
    this.options.clear()
    //this.question.setValue("")
    for (let i = 0; i < 2; i++) {
      this.options.push(this.createOption())
    }
    let tempDataStore = {
      answers: [],
      options: [],
      question: "",
      toBeDeleted: false
    }
    tempDataStore["question"] = questionDataFromForm["question"]
    questionDataFromForm["answers"].forEach((element) => {
      tempDataStore["answers"].push({ "answer": element })
    });
    questionDataFromForm["options"].forEach(element => {
      tempDataStore["options"].push({ "option": element })
    })
    if(this.currentQuestion == this.questions.length){
      this.questions.push(tempDataStore)
    }
    this.currentQuestion = this.questions.length
    this.questionForm.reset()
    console.log(this.questions)
    this.disableButtons()
  }
  canComplete() {
    return this.questions.length >= 1
  }
  complete(password?: string) {
    if(this.questionForm.valid){
      this.onSubmit()
    }
    
   
    this.questions = this.questions.filter((element)=>{
      return element['id'] || !element['toBeDeleted']
    })
    

    let data = {
      quizId : this.quizId,
      title : this.title,
      questions: this.questions,
      password: password,
      creater_email: sessionStorage.getItem('creater_email')
    }
    console.log(data)
    
    
    this.showLoader = true
    this._creationService.updateQuiz(data).subscribe((res) => {
      this._router.navigate(['post-creation', this.quizId, password])
      this.showLoader = false
     }),
     (err)=>{
      if (err.status==200){
        this._router.navigate(['post-creation', this.quizId, password])
        this.showLoader = false
      }
    }

  }
  setQuestion(index) {
    this.question.setValue(this.questions[index]['question'])
    //console.log(this.options.controls[0]['controls']['check'].value)
    let answers: string[] = []
    let resAnswers: [] = this.questions[index]['answers']
    resAnswers.forEach(element => {
      if(element['answer']){
        answers.push(element['answer'])
      }
    });
    let resOptions: [] = this.questions[index]['options']
    let optionCount = 0
    console.log(resOptions)
    resOptions.forEach(element => {
      if (element["option"]) {
        optionCount++
      }
    })
    console.log("optioncount" + optionCount)
    for (let i = 0; i < optionCount; i++) {
      this.options.push(this.createOption())
      if (i > 1) {
        this.enableRmBtn = true
      }
      if (i >= 3) {
        this.optionsFull = true
      } else {
        this.optionsFull = false
      }
    }
    //console.log(resAnswers)
    console.log(resOptions.length)
    resOptions.forEach((element, idx) => {
      //console.log(answers.includes(element['option']))
      if (answers.includes(element['option'])) {
        this.options.controls[idx]['controls']['check'].value = true
      }
      if(element["option"]){
        this.options.controls[idx]['controls']['opt'].value = element['option']
      }
    });

  }
  isFormValid() {
    return this.questionForm.valid
  }
  nextQuestion() {
    console.log(this.currentQuestion)
    console.log(this.questions)
    this.enableRmBtn = false
    if(this.questionForm.valid){
      let questionDataFromForm = this.getQuestionData()
      this.questions[this.currentQuestion]["question"] = questionDataFromForm["question"]
      this.setAnswers(questionDataFromForm)
      this.setOptions(questionDataFromForm)
    }
    this.disablePreviousButton = false
    this.options.clear()
    this.currentQuestion++
    this.setQuestion(this.currentQuestion)
    // if (this.currentQuestion >= this.questions.length - 1) {
    //   this.disableNextButton = true
    // } else {
    //   this.disablePreviousButton = false
    // }
    //console.log(this.currentQuestion)
    this.disableButtons()
  }
  previousQuestion() {
    console.log(this.questions)
    console.log(this.currentQuestion)
    this.enableRmBtn = false
    if(this.questionForm.valid){
      let questionDataFromForm = this.getQuestionData()
      if(this.questions[this.currentQuestion]){
        this.questions[this.currentQuestion]["question"] = questionDataFromForm["question"]
        this.setAnswers(questionDataFromForm)
        this.setOptions(questionDataFromForm)
      }else{

        questionDataFromForm['options'].forEach((element,index)=>{
          questionDataFromForm['options'][index] = {"option":element}
        })
        questionDataFromForm['answers'].forEach((element,index)=>{
          questionDataFromForm['answers'][index] = {"answer":element}
        })
        questionDataFromForm['toBeDeleted']=false;
        this.questions.push(questionDataFromForm)
        // console.log(questionDataFromForm)
      }
    }
    this.disablePreviousButton = false
    this.options.clear()
    this.currentQuestion--
    this.setQuestion(this.currentQuestion)
    // if (this.currentQuestion == 0) {
    //   this.disablePreviousButton = true
    // } else {
    //   this.disableNextButton = false
    // }
    this.disableButtons()
  }
  disableButtons(){
    if(this.currentQuestion == 0){
      this.disablePreviousButton = true
    }else{
      this.disablePreviousButton = false
    }
    if(this.currentQuestion >= this.questions.length-1 ){
      this.disableNextButton = true
    }else{
      this.disableNextButton = false
    }
  }
  getQuestionData() {
    let questionData = {
      question: "",
      options: [],
      answers: []
    }
    questionData.question = this.questionForm.get('question').value

    questionData.answers = []
    questionData.options = []
    for (let group of this.options.controls) {
      questionData.options.push(group.get('opt').value)
      if (!!group.get('check').value) {
        questionData.answers.push(group.get('opt').value)
      }
    }
    return questionData
  }
  setAnswers(data) {
    let currentQuestionData = this.questions[this.currentQuestion]
    if (currentQuestionData["answers"].length == data["answers"].length) {
      data["answers"].forEach((element, index) => {
        currentQuestionData["answers"][index]["answer"] = element
      });
    } else if (currentQuestionData["answers"].length > data["answers"].length) {
      for (let index = 0; index < data["answers"].length; index++) {
        currentQuestionData["answers"][index]["answer"] = data["answers"][index]
      }
      for (let index = data["answers"].length; index < currentQuestionData["answers"].length; index++) {
        currentQuestionData["answers"][index]["id"] = ""
      }
    } else {
      for (let index = 0; index < currentQuestionData["answers"].length; index++) {
        currentQuestionData["answers"][index]["answer"] = data["answers"][index]
      }
      for (let index = currentQuestionData["answers"].length; index < data["answers"].length; index++) {
        currentQuestionData["answers"].push({ "answer": data["answers"][index] })
      }
    }
    console.log(this.questions)
  }
  setOptions(data) {
    let currentQuestionData = this.questions[this.currentQuestion]
    if (currentQuestionData["options"].length == data["options"].length) {
      data["options"].forEach((element, index) => {
        currentQuestionData["options"][index]["option"] = element
      });
    } else if (currentQuestionData["options"].length > data["options"].length) {
      for (let index = 0; index < data["options"].length; index++) {
        currentQuestionData["options"][index]["option"] = data["options"][index]
      }
      for (let index = data["options"].length; index < currentQuestionData["options"].length; index++) {
        currentQuestionData["options"][index]["option"] = ""
      }
    } else {
      for (let index = 0; index < currentQuestionData["options"].length; index++) {
        currentQuestionData["options"][index]["option"] = data["options"][index]
      }
      for (let index = currentQuestionData["options"].length; index < data["options"].length; index++) {
        currentQuestionData["options"].push({ "option": data["options"][index] })
      }
    }
    console.log(this.questions)
  }
  confirm(event: Event) {
    this._confirmationService.confirm({
        target: event.target,
        message: 'Current Question Will not be saved, Still want to proceed further',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.canSetPassword=true
        },
        reject: () => {
            //reject action
            this._messages.add({severity:"info",summary:"Continue editing..."})
        }
    });
  }
  
}

