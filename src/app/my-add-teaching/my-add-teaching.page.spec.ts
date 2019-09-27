import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAddTeachingPage } from './my-add-teaching.page';

describe('MyAddTeachingPage', () => {
  let component: MyAddTeachingPage;
  let fixture: ComponentFixture<MyAddTeachingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyAddTeachingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAddTeachingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
