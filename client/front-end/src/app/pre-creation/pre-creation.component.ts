import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms'
import { CustomValidators } from '../shared/customValidators/custom.validator';
import { CreationService } from '../services/creation.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router'
import { identifierModuleUrl } from '@angular/compiler';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-pre-creation',
  templateUrl: './pre-creation.component.html',
  styleUrls: ['./pre-creation.component.scss']
})
export class PreCreationComponent implements OnInit {
  testAnswers: string[] = [];
  questionForm: FormGroup;
  optionsFull: boolean;
  enableRmBtn: boolean;
  canSetPassword: boolean;
  canSetTitle: boolean = true;
  something: string;
  questionSet = {
    title: '',
    creater_email: '',
    questions: []
  };
  showLoader: boolean;
  constructor(public _formBuilder: FormBuilder, public _creationService: CreationService, public router: Router, public _cdr: ChangeDetectorRef, public _messages: MessageService) { }

  ngOnInit(): void {

    this.questionForm = this._formBuilder.group({
      question: ['', [Validators.required]],
      options: this._formBuilder.array([
        this._formBuilder.group({
          check: [{ value: false, disabled: false }],
          opt: [{ value: '', disabled: false }, [Validators.required]]
        }),
        this._formBuilder.group({
          check: [{ value: false, disabled: false }],
          opt: [{ value: '', disabled: false }, [Validators.required]]
        })
      ]),
    }, { validators: [CustomValidators.AnswerValidator, CustomValidators.OptionValidator] })
    console.log(this.questionForm)
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
    this.questionSet.title = value
    this.canSetTitle = false
  }
  addOption() {
    this.options.push(this.createOption())
    if (this.options.length > 2) {
      this.enableRmBtn = true
    }
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
  onSubmit() {
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

    this.questionSet.questions.push(questionData)
    this.questionSet['creater_email'] = sessionStorage.getItem('creater_email')
    this.questionForm.reset()
    console.log(this.questionSet)
  }
  canComplete() {
    return this.questionSet.questions.length >= 1 && this.questionForm.valid
  }
  complete(password?: string) {
    this.showLoader = true
    this.onSubmit()
    // let data = {
    //   questionSet: this.questionSet,
    //   password: password,
    //   creater_email: sessionStorage.getItem('creater_email')
    // }

    this.questionSet['password'] = password;
    // console.log(data)


    this._creationService.postQuestionSet(this.questionSet).subscribe((res) => {
      this.showLoader = false
      if (res['message'] === 'success') {
        let id = res['data'].id
        console.log(id)
        this.router.navigate(['post-creation', id, password])
      }

    },
      err => {
        this._messages.add({ severity: "error", summary: "Something went wrong" })
      })

  }

}
