import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCourseListPage } from './my-course-list.page';

describe('MyCourseListPage', () => {
  let component: MyCourseListPage;
  let fixture: ComponentFixture<MyCourseListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyCourseListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyCourseListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
