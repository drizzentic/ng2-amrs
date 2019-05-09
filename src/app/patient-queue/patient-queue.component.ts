import { Component, OnInit } from '@angular/core';
import * as Moment from 'moment';

import { DailyScheduleResourceService } from '../etl-api/daily-scheduled-resource.service';

import {take} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {ClinicDashboardCacheService} from '../clinic-dashboard/services/clinic-dashboard-cache.service';
import {UserDefaultPropertiesService} from '../user-default-properties';
import {SelectDepartmentService} from '../shared/services/select-department.service';
import {LocalStorageService} from '../utils/local-storage.service';

@Component({
  selector: 'app-patient-queue',
  templateUrl: './patient-queue.component.html',
  styleUrls: ['./patient-queue.component.css']
})
export class PatientQueueComponent implements OnInit {
  public patientQueue: any[] = [];
  public hideAppointments = false;
  public currentDate = Moment().format('MMM  D , YYYY ');
  public queuePage = 1;
  public routeSub: Subscription;
  public errors: any = [];
  public route: ActivatedRoute;
  public title = 'Patient Queue';
  public params: any = {
    'programType': [],
    'visitType': [],
    'encounterType': []
  };
  public selectedLocation: any;
  public currentDepartment: any;
  public nextStartIndex  = 0;
  public selectedDepartment: any;

  constructor(
   private dailyScheduleResource: DailyScheduleResourceService,
   private clinicDashboardCacheService: ClinicDashboardCacheService,
   private userDefaultProperties: UserDefaultPropertiesService,
   private selectDepartmentService: SelectDepartmentService,
   private localStorageService: LocalStorageService
  ) { }

  ngOnInit() {
    // Invoke fetching of patient queue if department is Oncology
    if (this.getCurrentDepartment() === 'ONCOLOGY') {
      // this.selectedDepartment = selectedDepartment;
      this.selectedLocation = this.userDefaultProperties.getCurrentUserDefaultLocationObject();
      this.currentDate = Moment(new Date()).format('YYYY-MM-DD');
      this.getPatientQueue();
    }
  }

  public startAppointment(patient) {
    // Initiate patientQueue from a certain location

  }

  public getPatientQueue() {
    const params = this.setQueryParams();
    const result = this.dailyScheduleResource.getDailyAppointments(params);
    if (result === null) {

      throw new Error('Null daily patientQueues observable');
    } else {
      result.pipe(take(1)).subscribe(
        (patientList) => {
          if (patientList) {
            this.patientQueue = patientList;
            this.hideAppointments = true;
          }
        }
        ,
        (error) => {
          this.errors.push({
            id: 'Daily Schedule Appointments',
            message: 'error fetching daily schedule patientQueue',
            error: error
          });
        }
      );
    }

  }
  // Get current loaded department
  public getCurrentDepartment() {
    let department = this.localStorageService.getItem('userDefaultDepartment');
    // Default department set to Oncology
    if (department === '[""]') {
      department = 'ONCOLOGY';
    } else {
      department = this.selectDepartmentService.getUserSetDepartment();
    }
    this.currentDepartment = department;

    return this.currentDepartment;
  }

  // Set the default query parameters
  private setQueryParams() {

    let encounterType: any = [];

    if (this.params.encounterType && this.params.encounterType.length > 0) {
      encounterType = this.params.encounterType;
    }
    return {
      startDate: this.currentDate,
      startIndex: this.nextStartIndex,
      locationUuids: this.selectedLocation.uuid,
      encounterType: encounterType,
      limit: 1000
    };

  }

}
