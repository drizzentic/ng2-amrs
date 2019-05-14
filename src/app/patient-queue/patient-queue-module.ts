import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {routes} from '../clinic-dashboard/clinic-dashboard.routes';
import {PatientQueueComponent} from './patient-queue.component';
import {ClinicDashboardCacheService} from '../clinic-dashboard/services/clinic-dashboard-cache.service';
import {CommonModule} from '@angular/common';
import {UserDefaultPropertiesService} from '../user-default-properties';
import {DailyScheduleResourceService} from '../etl-api/daily-scheduled-resource.service';
import { AppointmentResourceService } from '../openmrs-api/appointment-resource-service';
import { TodaysVitalsComponent } from '../patient-dashboard/common/todays-vitals/todays-vitals.component';

@NgModule({
  declarations: [
    PatientQueueComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [
    ClinicDashboardCacheService,
    UserDefaultPropertiesService,
    DailyScheduleResourceService,
    AppointmentResourceService,
    TodaysVitalsComponent
  ],
  exports: [
    PatientQueueComponent
  ]
})
export class PatientQueueModule {
  public static routes = routes;
}
