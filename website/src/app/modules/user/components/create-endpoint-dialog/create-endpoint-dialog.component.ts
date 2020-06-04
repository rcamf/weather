import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EndpointService } from 'src/app/core/endpoint.service';
import { degreesValidator } from '../../directives/degrees-validator.directive';

@Component({
  selector: 'app-create-endpoint-dialog',
  templateUrl: './create-endpoint-dialog.component.html',
  styleUrls: ['./create-endpoint-dialog.component.scss']
})
export class CreateEndpointDialogComponent implements OnInit {
  createForm: FormGroup

  constructor(public dialogRef: MatDialogRef<CreateEndpointDialogComponent>, @Inject(MAT_DIALOG_DATA) public data, private _endpointService: EndpointService) { }

  ngOnInit() {
    this.createForm = new FormGroup({
      city: new FormControl('', [
        Validators.required
      ]),
      country: new FormControl('', [
        Validators.required
      ]),
      lat: new FormControl('', [
        Validators.required,
        degreesValidator(90)
      ]),
      long: new FormControl('', [
        Validators.required,
        degreesValidator(180)
      ])
    })
  }

  create() {
    if (this.createForm.valid) {
      this._endpointService.postEndpoint(
        this.createForm.get('city').value,
        this.createForm.get('country').value,
        this.createForm.get('lat').value,
        this.createForm.get('long').value,
        this.data.token
      ).subscribe(
        res => this.dialogRef.close(),
        error => {
          if (error.includes('exists')) {
            this.createForm.get('city').setErrors({ conflict: true })
          } else {
            console.log(error)
          }
        }
      )
    }
  }
}
