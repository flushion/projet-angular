import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpInfosComponent } from './pop-up-infos.component';

describe('PopUpInfosComponent', () => {
  let component: PopUpInfosComponent;
  let fixture: ComponentFixture<PopUpInfosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PopUpInfosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopUpInfosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
