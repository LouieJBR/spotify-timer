import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentTrackComponent } from './current-track.component';

describe('CurrentTrackComponent', () => {
  let component: CurrentTrackComponent;
  let fixture: ComponentFixture<CurrentTrackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentTrackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
