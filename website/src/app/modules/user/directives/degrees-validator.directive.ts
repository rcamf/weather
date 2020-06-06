import { ValidatorFn, AbstractControl } from '@angular/forms'

export function degreesValidator(max: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!isNaN(control.value) && -max <= control.value && max >= control.value) return null
    return { invalidDegree: true }
  }
}