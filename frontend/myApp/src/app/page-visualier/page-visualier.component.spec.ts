import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageVisualierComponent } from './page-visualier.component';

describe('PageVisualierComponent', () => {
  let component: PageVisualierComponent;
  let fixture: ComponentFixture<PageVisualierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageVisualierComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PageVisualierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
