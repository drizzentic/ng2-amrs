import {Observable} from 'rxjs';

export class DepartmentServiceStub {
  getUserSetDepartment() {
    return Observable.from([
      'ONCOLOGY'
    ]);
  }
}
