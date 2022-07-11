import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseEditorComponent } from './course-editor.component';
import {RouterModule, Routes} from "@angular/router";

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
  declarations: [CourseEditorComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class CourseEditorModule {}
