import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecorativeChileComponent } from './decorative-chile.component';

describe('DecorativeChileComponent', () => {
  let component: DecorativeChileComponent;
  let fixture: ComponentFixture<DecorativeChileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DecorativeChileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DecorativeChileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
