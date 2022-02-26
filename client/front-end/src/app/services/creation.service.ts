import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'
import { JsonPipe } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class CreationService {

  url = "http://192.168.1.29:4200/";
  constructor(public _http:HttpClient) { }

  postQuestionSet(questionSet){
    console.log('dataSending..')
    return this._http.post<any>(this.url+'api/quiz',questionSet).pipe((res)=>{
      return res
    })
  }
  
  GetQuizDetails(){
    return this._http.get<any>(this.url+'api/quiz/lobby-details')
  }
  GetQuiz(id){
    return this._http.get<any>(this.url+'api/quiz/'+id)
  }
  GetEmails(){
    return this._http.get<any>(this.url+'api/profile/emails').pipe(
      map(res=>{
        return res['emails']
      })
    )
  }
  CreateUser(value){
    return this._http.post<any>(this.url+'api/profile/',value)
  }
  sendEmail(value){
    return this._http.post<any>(this.url+'api/recovery',value)
  }
  updatePassword(value){
    return this._http.post<any>(this.url+'api/update-password',value)
  }
  getProfileDetails(){
    return this._http.post<any>(this.url+'api/profile/details', { user: { email: sessionStorage.getItem('creater_email')}})
  }
  submitQuiz(value){
    return this._http.post<any>(this.url+'api/quiz/submit-quiz',value)
  }
  giveFeedback(value){
    return this._http.post<any>(this.url+'api/feedback',value)
  }
  getResults(id){
    return this._http.get<any>(this.url+'api/quiz/results/'+id)
  }
  downloadReport(id){
    return this._http.get<any>(this.url+'api/results/'+id)
  }
  getDetailedQuiz(id){
    return this._http.get<any>(this.url+'api/quiz/detailedQuiz/'+id)
    .pipe(map(res=>{
      // res = res['message']
      res['questions'].forEach(element => {
        element['toBeDeleted'] = false
      });
      console.log(res)
      return res
    })
    )
  }
  updateQuiz(data){
    try {
      data  = JSON.parse(data)
     } catch(e) {
       data = data
     }
    return this._http.post<any>(this.url+'api/quiz/updateQuiz',data)
  }

  deleteQuiz(data){
    return this._http.post<any>(this.url+"api/quiz/deleteQuiz", data);
  }
}
