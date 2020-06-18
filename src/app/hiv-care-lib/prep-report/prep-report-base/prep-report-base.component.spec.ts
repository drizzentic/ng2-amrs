import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepReportBaseComponent } from './prep-report-base.component';

describe('PrepReportBaseComponent', () => {
  let component: PrepReportBaseComponent;
  let fixture: ComponentFixture<PrepReportBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrepReportBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepReportBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
