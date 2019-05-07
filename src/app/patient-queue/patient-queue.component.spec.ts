import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientQueueComponent } from './patient-queue.component';

describe('PatientQueueComponent', () => {
  let component: PatientQueueComponent;
  let fixture: ComponentFixture<PatientQueueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientQueueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
