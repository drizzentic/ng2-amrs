import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientQueueComponent } from './patient-queue.component';
import {DailyScheduleResourceService} from '../etl-api/daily-scheduled-resource.service';
import {ClinicDashboardCacheService} from '../clinic-dashboard/services/clinic-dashboard-cache.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {AppSettingsService} from '../app-settings/app-settings.service';
import {LocalStorageService} from '../utils/local-storage.service';
import {DataCacheService} from '../shared/services/data-cache.service';
import {CacheService} from 'ionic-cache';
import {CacheStorageService} from 'ionic-cache/dist/cache-storage';
import {UserDefaultPropertiesService} from '../user-default-properties';
import {UserService} from '../openmrs-api/user.service';
import {SessionStorageService} from '../utils/session-storage.service';
import {SelectDepartmentService} from '../shared/services/select-department.service';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {DepartmentServiceStub} from './patient-queue-department-service-stub';
import { AppointmentResourceService } from '../openmrs-api/appointment-resource-service';
import { EncounterResourceService } from '../openmrs-api/encounter-resource.service';
import { Router } from '@angular/router';

class MockCacheStorageService {
  constructor(a, b) { }

  public ready() {
    return true;
  }
}
describe('PatientQueueComponent', () => {
  let component: PatientQueueComponent;
  let fixture: ComponentFixture<PatientQueueComponent>;
  let service: SelectDepartmentService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientQueueComponent ],
      providers: [
        DailyScheduleResourceService,
        ClinicDashboardCacheService,
        DailyScheduleResourceService,
        AppSettingsService,
        LocalStorageService,
        DataCacheService,
        CacheService,
        {
          provide: CacheStorageService, useFactory: () => {
            return new MockCacheStorageService(null, null);
          }
        },
        UserDefaultPropertiesService,
        UserService,
        SessionStorageService,
        {
          provide: SelectDepartmentService,
          useClass: DepartmentServiceStub
        },
        AppointmentResourceService,
        EncounterResourceService,
        Router
      ],
       imports: [
         HttpClientTestingModule
       ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientQueueComponent);
    component = fixture.componentInstance;
    service = TestBed.get(SelectDepartmentService);
    fixture.detectChanges();
  });
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    console.log('Dept', component.getCurrentDepartment());
    expect(component).toBeTruthy();
  });

  it('Should have current date for daily appointments and title set', async(() => {
     expect(component.title).toBe('Patient Queue');
     expect(component.currentDate).toBeDefined();
  }));

  it('Should check current department', async(() => {
    component.getCurrentDepartment().subscribe((data) => {
      expect(data).toEqual('ONCOLOGY');
      expect(component.selectedDepartment).toBeUndefined();
    });
  }));
});
