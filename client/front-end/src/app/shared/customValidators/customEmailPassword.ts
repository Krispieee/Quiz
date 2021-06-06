import { ValidatorFn, AbstractControl } from '@angular/forms';

export function ConfirmEmailValidator(forbiddenEmail: string[]): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const givenMail = control.value;
     console.log(control)   
    return !forbiddenEmail.includes(givenMail) ? { 'emailNotPresent': { value: control.value } } : null;
  };
}
