import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveMmessagesPage } from './leave-mmessages.page';

describe('LeaveMmessagesPage', () => {
  let component: LeaveMmessagesPage;
  let fixture: ComponentFixture<LeaveMmessagesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveMmessagesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveMmessagesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
