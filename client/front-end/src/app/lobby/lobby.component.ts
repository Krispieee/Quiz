import { Component, OnInit } from '@angular/core';
import { CreationService } from "../services/creation.service";


@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {
  query:string;
  details:[]
  
  constructor(public _creationService:CreationService) { }

  ngOnInit(): void {
    this._creationService.GetQuizDetails().subscribe( res =>{
      this.details=res;
      console.log(this.details)
    } )
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
