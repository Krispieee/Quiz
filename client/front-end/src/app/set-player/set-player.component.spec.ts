import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetPlayerComponent } from './set-player.component';

describe('SetPlayerComponent', () => {
  let component: SetPlayerComponent;
  let fixture: ComponentFixture<SetPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetPlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
