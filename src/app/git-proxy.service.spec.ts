import { TestBed, inject } from '@angular/core/testing';

import { GitProxyService } from './git-proxy.service';

describe('GitProxyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GitProxyService]
    });
  });

  it('should be created', inject([GitProxyService], (service: GitProxyService) => {
    expect(service).toBeTruthy();
  }));
});
