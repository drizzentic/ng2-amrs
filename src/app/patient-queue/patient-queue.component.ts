import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import * as Moment from 'moment';

import { DailyScheduleResourceService } from '../etl-api/daily-scheduled-resource.service';

import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ClinicDashboardCacheService } from '../clinic-dashboard/services/clinic-dashboard-cache.service';
import { UserDefaultPropertiesService } from '../user-default-properties';
import { SelectDepartmentService } from '../shared/services/select-department.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { AppointmentResourceService } from '../openmrs-api/appointment-resource-service';
import * as _ from 'lodash';
import * as moment from 'moment';
@Component({
  selector: 'app-patient-queue',
  templateUrl: './patient-queue.component.html',
  styleUrls: ['./patient-queue.component.css']
})
export class PatientQueueComponent implements OnInit, OnDestroy {

  public patientQueue: any[] = [];
  public patientVisit: any[] = [];
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
  public nextStartIndex = 0;
  public selectedDepartment: any;
  constructor(
    private dailyScheduleResource: DailyScheduleResourceService,
    private clinicDashboardCacheService: ClinicDashboardCacheService,
    private userDefaultProperties: UserDefaultPropertiesService,
    private selectDepartmentService: SelectDepartmentService,
    private localStorageService: LocalStorageService,
    private patientAppointmentService: AppointmentResourceService,
    private router: Router
  ) { }

  ngOnInit() {
    // Invoke fetching of patient queue if department is Oncology
    if (this.getCurrentDepartment() === 'ONCOLOGY') {
      // this.selectedDepartment = selectedDepartment;
      this.selectedLocation = this.userDefaultProperties.getCurrentUserDefaultLocationObject();
      this.currentDate = Moment(new Date()).format('YYYY-MM-DD');
      this.getPatientAppointmentQueue();
    }
  }

  ngOnDestroy(): void {
    this.patientQueue = [];
  }
  getPatientAppointmentQueue() {
    /**
     * Get the appointments and loop through them to get the encounters. 
     * Loop through the encounters to find the initial oncology form with diagnosis.
     * Ecog values
     * push the values to a new object with all datasets defined ()
     * TODO: Obtain Vitals for current visit
     */
    let patientDetails: any = {}
    let that = this;

    this.patientAppointmentService
    .getPatientAppointments({ fromDate: this.currentDate, status: 'WAITING', location: this.selectedLocation.uuid })
      .subscribe((patientapptns) => {
        if (patientapptns.length > 0) {
          _.each(patientapptns, function (appointment) {
            const startDateTime = appointment.visit.startDatetime
            const encounterObs = that.getInitialEncounter(appointment.visit.encounters);
            //Filter using general oncology uuid
            patientDetails.appointment = appointment
            patientDetails.startDateTime = moment(startDateTime).format('hh:mm');
            patientDetails.diagnosis = that.getDiagnosisObs(encounterObs);
            patientDetails.triage = that.getTriageObs(encounterObs);
            patientDetails.waitingTime = that.calculateWaitingTime(patientDetails.obs, startDateTime);
          });
          this.patientQueue.push(patientDetails);
          this.hideAppointments = true;
        }
        console.log('Patient Queue', this.patientQueue)
      });
  }
  public getTriageObs(encounterObs: any): any {
    if (_.isArray(encounterObs)) {
      return encounterObs.filter(
        el => el.concept.uuid == 'de2df280-4d34-466e-a894-f47cfec18f81'
      );
    } else {
      return 'N/A'
    }
  }

  //Get the obs with Cancer type
  public getDiagnosisObs(encounterObs: any): any {

    /**
     * For each detailed cancer type group member.
     * Obtain the value uuid
     * Then access the name of the cancer type
     * Search again for an encouter for that cancer type inorder to obtain the real mapping of the cancer
     */
    let detailedCancerType = {}
    if (_.isArray(encounterObs)) {
      detailedCancerType = encounterObs.filter(
        el => el.concept.uuid == 'f8f6f4de-d73f-4848-9793-9a0b575646e7'
      );
      let cancerDiagnoses = ''
      _.each(detailedCancerType, function (cancerType) {
        _.each(cancerType['groupMembers'], function (groupMembers) {
          let b = encounterObs.filter(el => el.concept.name.display.split(",", 1)[0] == groupMembers['value'].display)
          
          _.each(b[0].groupMembers, function (diagnosis) {
            cancerDiagnoses += diagnosis.value.display
          })
        })
      })
      return cancerDiagnoses;
    } else {
      return 'N/A'
    }
  }
  //Get Encounter
  public getInitialEncounter(encounters) {
    return encounters.filter(el => el.uuid == "de2df280-4d34-466e-a894-f47cfec18f81")
  }

  //Calculate Waiting time
  public calculateWaitingTime(obs, startDateTime) {
    let obsDateTime = ""
    if (_.isArray(obs)) {
      //Obtain time for latest Obs and subtract from startDateTime
      obsDateTime = obs[0].obsDateTime;
    } else {
      obsDateTime = startDateTime;
    }
    var now = moment();
    var then = obsDateTime;

    var s = moment(now.diff(then)).utcOffset(0).format('HH:mm');

    return moment.duration(s, "minutes").humanize();
  }

  public startAppointment(patientUuid) {
    // Initiate patientQueue from a certain location
    this.router.navigate(['/patient-dashboard/patient/' + patientUuid +
      '/general/general/landing-page']);
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
            //this.patientQueue = patientList;
            this.hideAppointments = true;
            this.patientQueue = patientList
            //Get patient details and vitals
            patientList.forEach(patient => {
             // this.getVisit(patient.patient_uuid)
            });
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
