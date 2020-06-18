import { TestBed, inject } from '@angular/core/testing';

import { PrepResourceService } from './prep-resource.service';

describe('PrepResourceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrepResourceService]
    });
  });

  it('should be created', inject([PrepResourceService], (service: PrepResourceService) => {
    expect(service).toBeTruthy();
  }));
});
