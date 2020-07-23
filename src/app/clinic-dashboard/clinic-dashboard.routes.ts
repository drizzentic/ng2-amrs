import { ClinicDashboardComponent } from './clinic-dashboard.component';
import { ClinicDashboardGuard } from './clinic-dashboard.guard';
import { MicroFrontendReportComponent } from './micro-frontend-report/micro-frontend-report.component';
export const routes = [
  {
    path: '',
    children: [
      { path: '', component: ClinicDashboardComponent },
      {
        path: ':location_uuid',
        component: ClinicDashboardComponent,
        canActivate: [ClinicDashboardGuard],
        canDeactivate: [ClinicDashboardGuard],
        children: [
          {
            path: 'cdm',
            loadChildren: './cdm/cdm-program.module#CdmModule'
          },
          {
            path: 'general',
            loadChildren: './general/general.module#GeneralModule'
          },
          {
            path: 'hiv',
            loadChildren: './hiv/hiv-program.module#HivProgramModule'
          },
          {
            path: 'hemato-oncology',
            loadChildren:
              './oncology/oncology-program.module#OncologyProgramModule'
          },
          {
            path: 'microfrontend-reports',
            component: MicroFrontendReportComponent
          },
          { path: '', redirectTo: 'general', pathMatch: 'prefix' }
        ]
      }
    ]
  }
];
