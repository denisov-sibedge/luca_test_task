import { Component, OnInit } from '@angular/core';
import { ControlContainer, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-course-editor-author',
  templateUrl: './course-editor-author.component.html',
  styleUrls: ['./course-editor-author.component.scss'],
})
export class CourseEditorAuthorComponent implements OnInit {
  public formControl?: FormGroup;
  constructor(private controlContainer: ControlContainer) {}

  ngOnInit(): void {
    this.formControl = <FormGroup>this.controlContainer.control;
  }
}
