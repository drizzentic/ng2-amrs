import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AppSettingsService } from "../app-settings/app-settings.service";
import { catchError, map, take } from "rxjs/operators";
import {throwError as observableThrowError } from 'rxjs';
import { EncounterResourceService } from "./encounter-resource.service";
@Injectable()
export class AppointmentResourceService {

    constructor(private http: HttpClient, 
        private appSettingsService: AppSettingsService, 
        private _encounterResourceService: EncounterResourceService) { }

public getPatientAppointments(searchParams) {
    if (!searchParams) {
        return null;
    }

    const params = new HttpParams()
    .set('location', searchParams.location)
    .set('status', searchParams.status)
    .set('fromDate', searchParams.fromDate);
    return this.http
    .get(`${this.appSettingsService.getOpenmrsRestbaseurl().trim()}appointmentscheduling/appointment`,{
        params: params
    }).pipe(
    map(this.parseAppointmentResponse),
    catchError(this.handleError)
    );
}

public getEncounterDetails(encounterUuid){
    return this._encounterResourceService.getEncounterByUuid(encounterUuid).pipe(
       take(1),
       catchError(this.handleError));   
}

public parseAppointmentResponse(res: any): any {
    const result = res.results;
    return result;
}

private handleError(error: any) {
    return observableThrowError(error.message
        ? error.message
        : error.status
            ? `${error.status} - ${error.statusText}`
            : 'Server Error');
}

}
