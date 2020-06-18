import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepReportPatientListComponent } from './prep-report-patient-list.component';

describe('PrepReportPatientListComponent', () => {
  let component: PrepReportPatientListComponent;
  let fixture: ComponentFixture<PrepReportPatientListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrepReportPatientListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepReportPatientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
