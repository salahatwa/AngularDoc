import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateLogsComponent } from './update-logs.component';

describe('UpdateLogsComponent', () => {
  let component: UpdateLogsComponent;
  let fixture: ComponentFixture<UpdateLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
