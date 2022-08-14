import { TestBed } from '@angular/core/testing';

import { ComputerTypeService } from './computer-type.service';

describe('ComputerTypeService', () => {
  let service: ComputerTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComputerTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
