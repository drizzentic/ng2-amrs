import { Component, OnInit } from '@angular/core';
import { PrepReportBaseComponent } from 'src/app/hiv-care-lib/prep-report/prep-report-base/prep-report-base.component';
import { Router, ActivatedRoute } from '@angular/router';
import { PrepResourceService } from 'src/app/etl-api/prep-resource.service';

@Component({
  selector: 'prep-reports',
  templateUrl: '../../../hiv-care-lib/prep-report/prep-report-base/prep-report-base.component.html',
})
export class PrepReportComponent extends PrepReportBaseComponent implements OnInit {

  constructor(public router: Router,
    public route: ActivatedRoute, public prepReport: PrepResourceService) {
    super(router, route, prepReport);
  }
  public params: any;
  public prepReportSummaryData: any = [];
  public columnDefs: any = [];

  public statusError = false;
  public errorMessage = '';
  public showInfoMessage = false;
  public isLoading = false;
  ngOnInit() {
    this.route.queryParams.subscribe(
      (params: any) => {
            if (params && params.month) {
                this.isLoading = true;
                this.params = params;
                this.generateReport(params);
            }
      },
      error => {
        console.error('Error', error);
        this.showInfoMessage = true;
      }
    );
  }

}
