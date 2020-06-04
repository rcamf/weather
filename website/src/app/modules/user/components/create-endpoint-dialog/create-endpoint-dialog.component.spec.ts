import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEndpointDialogComponent } from './create-endpoint-dialog.component';

describe('CreateEndpointDialogComponent', () => {
  let component: CreateEndpointDialogComponent;
  let fixture: ComponentFixture<CreateEndpointDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEndpointDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEndpointDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
