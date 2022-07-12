import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseEditorAuthorComponent } from './course-editor-author.component';

describe('CourseEditorAuthorComponent', () => {
  let component: CourseEditorAuthorComponent;
  let fixture: ComponentFixture<CourseEditorAuthorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseEditorAuthorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseEditorAuthorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
