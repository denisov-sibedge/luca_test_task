import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data/data.service';
import { Observable } from 'rxjs';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss'],
})
export class CourseListComponent{
  courses$: Observable<Course[]> = this.dataService.courses$;
  constructor(private readonly dataService: DataService) {}
}
