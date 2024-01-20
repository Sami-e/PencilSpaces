import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IFramePageComponent } from './iframe-page.component';

describe('IFramePageComponent', () => {
  let component: IFramePageComponent;
  let fixture: ComponentFixture<IFramePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IFramePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IFramePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
