import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestViewCoursePage } from './test-view-course.page';

describe('TestViewCoursePage', () => {
  let component: TestViewCoursePage;
  let fixture: ComponentFixture<TestViewCoursePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestViewCoursePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestViewCoursePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
