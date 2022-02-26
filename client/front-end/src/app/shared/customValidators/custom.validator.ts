import { HttpClient } from '@angular/common/http';
import { AbstractControl, Form, FormArray, FormControl, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreationService } from 'src/app/services/creation.service';

export class CustomValidators{
    
    constructor(public _creationService: CreationService){

    }
    
    static AnswerValidator(control: AbstractControl): { [key: string]: boolean } | null {
        const option:FormArray = control.get('options') as FormArray;
        let option_count = 0
        for(let group of option.controls){
            if(group.get('opt').valid){
                option_count=option_count+1
            }
        }
        
        let answer_count=0
        console.log(option_count==option.length,'option')
        if(option_count==option.length){
            for(let group of option.controls){
                if(!group.get('check').value){
                    answer_count+=1     
                } 
            }
        }
        
        return answer_count==option.length ? {'answersNotMade':true} : null 
    }
    
    
    static OptionValidator(control: AbstractControl): { [key: string]: boolean } | null {
        console.log(control)
        const option:FormArray = control.get('options') as FormArray;
    
        let group_count = 0
        for(let group of option.controls){
            if(group.dirty && group.invalid){
                group_count ++;
            }
        }
        
        return group_count == option.length ? {'optionsNotMade':true} : null

    }
    
    static createForbiddenEmailValidator(service:CreationService){
        return (control:AbstractControl) : Observable<ValidationErrors> =>{
            let email:string = control.value
            return service.GetEmails().pipe(map((response:string[])=>{
                console.log(response)
                if(response.includes(email.toLowerCase())){
                    return {'EmailTaken':true}
                }
            }, err=> {
                return {'EmailTaken':true}
            }))
        }
    }
    static createRequiredEmailValidator(service:CreationService){
        return (control:AbstractControl) : Observable<ValidationErrors> =>{
            let email:string = control.value
            return service.GetEmails().pipe(map((response:string[])=>{
                if(!response.includes(email.toLowerCase())){
                    console.log(response)
                    return {'NotValidEmail':true}
                }
            }))
        }
    }

    static ForbiddenEmailValidator(control: AbstractControl,service:CreationService) : Promise<ValidationErrors> | null{
        let email:string = control.value
        
        return new Promise((resolve,reject)=>{
            service.GetEmails().subscribe((response)=>{
                if(response.includes(email)){
                    resolve({'EmailTaken': true })
                }else{
                    resolve(null) 
                }
            })
        })
    }
    static forbiddenEmailValidatorT(control: AbstractControl) : Promise<ValidationErrors> | null{
        return null
    }
}

