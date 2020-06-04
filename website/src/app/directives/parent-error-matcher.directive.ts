import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';

export class ParentErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const controlTouched = !!(control && (control.dirty || control.touched))
    const contorlInvalid = !!(control && control.invalid)
    const parentInvalid = !!(control && control.parent && control.parent.hasError('noMatch') && (control.parent.dirty || control.parent.touched))

    return controlTouched && (contorlInvalid || parentInvalid)
  }
}