import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhototequeComponent } from './phototeque.component';

describe('PhototequeComponent', () => {
  let component: PhototequeComponent;
  let fixture: ComponentFixture<PhototequeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PhototequeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PhototequeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
