import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseClassificationPage } from './course-classification.page';

describe('CourseClassificationPage', () => {
  let component: CourseClassificationPage;
  let fixture: ComponentFixture<CourseClassificationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseClassificationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseClassificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
