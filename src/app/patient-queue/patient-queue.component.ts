import { Component, OnInit } from '@angular/core';
import * as Moment from 'moment';

import { DailyScheduleResourceService } from '../etl-api/daily-scheduled-resource.service';

import {take} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {ClinicDashboardCacheService} from '../clinic-dashboard/services/clinic-dashboard-cache.service';
import {UserDefaultPropertiesService} from '../user-default-properties';

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
  public errors: any[] = [];
  public route: ActivatedRoute;
  public params: any = {
    'programType': [],
    'visitType': [],
    'encounterType': []
  };
  public selectedLocation: any;
  public nextStartIndex  = 0;

  constructor(
   private dailyScheduleResource: DailyScheduleResourceService,
   private clinicDashboardCacheService: ClinicDashboardCacheService,
   private userDefaultProperties: UserDefaultPropertiesService,
  ) { }

  ngOnInit() {

    this.selectedLocation = this.userDefaultProperties.getCurrentUserDefaultLocationObject();
    this.currentDate = Moment(new Date()).format('YYYY-MM-DD');
    this.getPatientQueue();

  }

  public startAppointment(patient) {
    // Initiate patientQueue from a certain location

  }

  private getPatientQueue() {
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
            message: 'error fetching daily schedule patientQueue'
          });
        }
      );
    }

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
