import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseAlivePage } from './course-alive.page';

describe('CourseAlivePage', () => {
  let component: CourseAlivePage;
  let fixture: ComponentFixture<CourseAlivePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseAlivePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseAlivePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
