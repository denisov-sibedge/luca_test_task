import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseListComponent } from '@components/course-list/course-list.component';

const routes: Routes = [
  {
    path: 'editor',
    loadChildren: () =>
      import('./modules/course-editor/course-editor.module').then(
        (m) => m.CourseEditorModule
      ),
  },
  {
    path: '',
    component: CourseListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
