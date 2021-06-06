import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterQuiz'
})
export class FilterQuizPipe implements PipeTransform {

  transform(pipeData:any,pipeFilter:string): any {
    console.log()
    return pipeData.filter( details => {
      return details['title'].toLowerCase().includes(pipeFilter.toLowerCase())
    } )
  }

}
