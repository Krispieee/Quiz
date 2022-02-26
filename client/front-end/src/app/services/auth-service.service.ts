import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import  jwt_decode  from 'jwt-decode'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  url = "http://192.168.1.29:4200/";

  constructor(public _http:HttpClient) {
    
  }

  
  get currentUser(){
    return jwt_decode(sessionStorage.getItem("token"))
  }

  login(value){
    return this._http.post<any>(this.url+'api/profile/login',value);
  }

  getToken() {
    return sessionStorage.getItem('token')
  }

  isloggedIn() {
    let token = sessionStorage.getItem("token")
    if (!token){
      return false
    }
    return !this.isExpired()
  }
  isExpired(){
    // let expTime = new Date(0).setUTCSeconds(this.currentUser['exp'])
    // if (expTime > new Date().valueOf()){
    //   return false
    // }
    // return true
    return false
  }
  
}
