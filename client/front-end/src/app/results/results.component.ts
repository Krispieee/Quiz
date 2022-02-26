import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CreationService } from '../services/creation.service';
import { AuthServiceService } from '../services/auth-service.service';
import 'file-saver';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  id:string
  players:[]
  columns:any[] = [{"field":"player","col":"Player"},{"field":"score","col":"Score"},{"field":"numberOfQuestions","col":"Out of"}]

  constructor(public _activatedRoute:ActivatedRoute,public _creationService:CreationService,public _auth:AuthServiceService) { }

  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe((paramap:ParamMap)=>{
      this.id=paramap.get('quiz_id')
      this._creationService.getResults(this.id).subscribe(res=>{
        console.log(res)
        this.players=res
      })
    })
  }
  loggedIn(){
    console.log(this._auth.isloggedIn())
    return this._auth.isloggedIn()
  }
  downloadReport(){
    this._creationService.downloadReport(this.id)
  }
  getId(){
    return this.id
  }
  exportExcel() {
    import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(this.players);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, "Report");
    });
  }
  saveAsExcelFile(buffer: any, fileName: string): void {
    import("file-saver").then(FileSaver => {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
    });
}
}
