import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'
import { JsonPipe } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class CreationService {

  url = "http://192.168.1.2:4200/";
  constructor(public _http:HttpClient) { }

  postQuestionSet(questionSet){
    console.log('dataSending..')
    return this._http.post<any>(this.url+'api/post-questions',questionSet).pipe((res)=>{
      return res
    })
  }
  
  GetQuizDetails(){
    return this._http.get<any>(this.url+'api/lobby-details')
  }
  GetQuiz(id){
    return this._http.get<any>(this.url+'api/quiz/'+id)
  }
  GetEmails(){
    return this._http.get<any>(this.url+'api/Emails').pipe(
      map(res=>{
        return res['emails']
      })
    )
  }
  CreateUser(value){
    return this._http.post<any>(this.url+'api/create-user',value)
  }
  sendEmail(value){
    return this._http.post<any>(this.url+'api/recovery',value)
  }
  updatePassword(value){
    return this._http.post<any>(this.url+'api/update-password',value)
  }
  getProfileDetails(){
    return this._http.get<any>(this.url+'api/getProfile/'+localStorage.getItem('creater_email'))
  }
  submitQuiz(value){
    return this._http.post<any>(this.url+'api/submit-quiz',value)
  }
  giveFeedback(value){
    return this._http.post<any>(this.url+'api/feedback',value)
  }
  getResults(id){
    return this._http.get<any>(this.url+'api/results/'+id)
  }
  downloadReport(id){
    return this._http.get<any>(this.url+'api/results/'+id)
  }
  getDetailedQuiz(id){
    return this._http.get<any>(this.url+'api/detailedQuiz/'+id)
    .pipe(map(res=>{
      res = res['message']
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
    return this._http.post<any>(this.url+'api/updateQuiz',data)
  }
}
