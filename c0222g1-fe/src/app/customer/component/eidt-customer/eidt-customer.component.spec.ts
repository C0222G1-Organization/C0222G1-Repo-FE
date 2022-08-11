import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EidtCustomerComponent } from './eidt-customer.component';

describe('EidtCustomerComponent', () => {
  let component: EidtCustomerComponent;
  let fixture: ComponentFixture<EidtCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EidtCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EidtCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
