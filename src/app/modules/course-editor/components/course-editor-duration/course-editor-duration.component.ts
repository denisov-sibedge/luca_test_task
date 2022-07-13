import { Component, OnInit } from '@angular/core';
import { ControlContainer, FormGroup } from '@angular/forms';
import { DurationUnit } from '@models/duration-unit.enum';

@Component({
  selector: 'app-course-editor-duration',
  templateUrl: './course-editor-duration.component.html',
  styleUrls: ['./course-editor-duration.component.scss'],
})
export class CourseEditorDurationComponent implements OnInit {
  public formControl?: FormGroup;
  durationOptions = [
    { label: 'Day', value: DurationUnit.day },
    { label: 'Hour', value: DurationUnit.hour },
    { label: 'Week', value: DurationUnit.week },
    { label: 'Month', value: DurationUnit.month },
  ];
  constructor(private controlContainer: ControlContainer) {}

  ngOnInit(): void {
    this.formControl = <FormGroup>this.controlContainer.control;
  }
}
