import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreCreationComponent } from './pre-creation.component';

describe('PreCreationComponent', () => {
  let component: PreCreationComponent;
  let fixture: ComponentFixture<PreCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
