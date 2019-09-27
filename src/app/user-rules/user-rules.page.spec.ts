import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRulesPage } from './user-rules.page';

describe('UserRulesPage', () => {
  let component: UserRulesPage;
  let fixture: ComponentFixture<UserRulesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRulesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRulesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
