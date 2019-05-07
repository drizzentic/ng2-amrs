import {NgModule} from '@angular/core';
import {routes} from '../clinic-dashboard/clinic-dashboard.routes';
import {PatientQueueComponent} from './patient-queue.component';
import {ClinicDashboardCacheService} from '../clinic-dashboard/services/clinic-dashboard-cache.service';
import {CommonModule} from '@angular/common';
import {UserDefaultPropertiesService} from '../user-default-properties';

@NgModule({
  declarations: [
    PatientQueueComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [
    ClinicDashboardCacheService,
    UserDefaultPropertiesService
  ],
  exports: [
    PatientQueueComponent
  ]
})
export class PatientQueueModule {
  public static routes = routes;
}
