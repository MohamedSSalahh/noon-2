import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextilesManager } from './textiles-manager';

describe('TextilesManager', () => {
  let component: TextilesManager;
  let fixture: ComponentFixture<TextilesManager>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextilesManager]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextilesManager);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
