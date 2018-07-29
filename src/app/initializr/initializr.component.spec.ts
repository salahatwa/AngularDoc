import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitializrComponent } from './initializr.component';

describe('InitializrComponent', () => {
  let component: InitializrComponent;
  let fixture: ComponentFixture<InitializrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitializrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitializrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
