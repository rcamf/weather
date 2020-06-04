import { AbstractControl } from '@angular/forms';

export const matchValidator = (control: AbstractControl) => {
  if (control.get('password').value !== control.get('passwordConfirm').value)
    return { noMatch: true }
}