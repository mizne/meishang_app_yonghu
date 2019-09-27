import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareWaysPage } from './share-ways.page';

describe('ShareWaysPage', () => {
  let component: ShareWaysPage;
  let fixture: ComponentFixture<ShareWaysPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareWaysPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareWaysPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
