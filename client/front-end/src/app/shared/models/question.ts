export class Question{
    answer=[];
    id:number;
    option=[];
    question:string;
    proposedAnswer:boolean[]=[]
    deseiralize(input:any){
        Object.assign(this,input)
        this.proposedAnswer=Array(this.option.length).fill(false)
        return this
    }
}