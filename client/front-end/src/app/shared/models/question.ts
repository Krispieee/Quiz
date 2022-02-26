export class Question{
    answers=[];
    id:number;
    options=[];
    question:string;
    proposedAnswer:boolean[]=[]
    deseiralize(input:any){
        Object.assign(this,input)
        this.proposedAnswer=Array(this.options.length).fill(false)
        return this
    }
}