import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditMyTeachingPage } from './audit-my-teaching.page';

describe('AuditMyTeachingPage', () => {
  let component: AuditMyTeachingPage;
  let fixture: ComponentFixture<AuditMyTeachingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditMyTeachingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditMyTeachingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
