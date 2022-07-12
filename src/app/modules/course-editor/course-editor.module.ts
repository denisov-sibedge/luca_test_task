import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseEditorComponent } from './course-editor.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CourseEditorAuthorComponent } from './components/course-editor-author/course-editor-author.component';
import { CourseEditorDurationComponent } from './components/course-editor-duration/course-editor-duration.component';

const routes: Routes = [
  {
    path: '',
    component: CourseEditorComponent,
  },
  {
    path: ':id',
    component: CourseEditorComponent,
  },
];

@NgModule({
  declarations: [CourseEditorComponent, CourseEditorAuthorComponent, CourseEditorDurationComponent],
  imports: [CommonModule, RouterModule.forChild(routes), ReactiveFormsModule],
})
export class CourseEditorModule {}
