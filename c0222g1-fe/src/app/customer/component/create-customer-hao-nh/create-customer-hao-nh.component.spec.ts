import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCustomerHaoNHComponent } from './create-customer-hao-nh.component';

describe('CreateCustomerHaoNHComponent', () => {
  let component: CreateCustomerHaoNHComponent;
  let fixture: ComponentFixture<CreateCustomerHaoNHComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCustomerHaoNHComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCustomerHaoNHComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
