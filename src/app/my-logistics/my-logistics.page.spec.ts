import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyLogisticsPage } from './my-logistics.page';

describe('MyLogisticsPage', () => {
  let component: MyLogisticsPage;
  let fixture: ComponentFixture<MyLogisticsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyLogisticsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyLogisticsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
