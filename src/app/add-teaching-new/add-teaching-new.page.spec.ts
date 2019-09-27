import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTeachingNewPage } from './add-teaching-new.page';

describe('AddTeachingNewPage', () => {
  let component: AddTeachingNewPage;
  let fixture: ComponentFixture<AddTeachingNewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTeachingNewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTeachingNewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
