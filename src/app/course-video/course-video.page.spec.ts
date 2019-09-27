import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseVideoPage } from './course-video.page';

describe('CourseVideoPage', () => {
  let component: CourseVideoPage;
  let fixture: ComponentFixture<CourseVideoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseVideoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseVideoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
