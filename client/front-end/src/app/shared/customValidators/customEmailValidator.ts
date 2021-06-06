import { ValidatorFn, AbstractControl } from '@angular/forms';

export function ForbiddenEmailValidator(forbiddenEmail: string[]): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const givenMail = control.value;
    
    return forbiddenEmail.includes(givenMail) ? { 'forbiddenEmail': { value: control.value } } : null;
  };
}
