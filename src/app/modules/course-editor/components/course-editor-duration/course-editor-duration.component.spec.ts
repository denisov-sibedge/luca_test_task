import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseEditorDurationComponent } from './course-editor-duration.component';

describe('CourseEditorDurationComponent', () => {
  let component: CourseEditorDurationComponent;
  let fixture: ComponentFixture<CourseEditorDurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseEditorDurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseEditorDurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
