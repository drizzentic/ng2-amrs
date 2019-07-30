import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Observable } from 'rxjs';

@Injectable()
export class TreatmentSummaryResourceService {
    constructor(protected http: HttpClient, protected appSettingsService: AppSettingsService) {
    }

    public getUrl(): string {
        return this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'obs';
    }

    public getTreatmentSummaryTriage(patientUuid: string):
    Observable<any> {
        const v = 'custom:(person:(person,identifiers:(identifier)),' +
        'encounter:(uuid,display,obs:(uuid,concept:(display),value:(display)))';
        const url = this.getUrl();
        const params: HttpParams = new HttpParams()
            .set('v', v)
            .set('patient', patientUuid)
            .set('concepts', 'a8a660ca-1350-11df-a1f1-0026b9348838')
            .set('limit', '1');
        return this.http.get(url, {
            params: params
        });
    }
}
