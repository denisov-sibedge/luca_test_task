import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { Course } from '../../models/course.model';
import { DataService } from '../../services/data/data.service';

@Component({
  selector: 'app-course-editor',
  templateUrl: './course-editor.component.html',
  styleUrls: ['./course-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseEditorComponent implements OnInit, OnDestroy {
  private componentAlive$: Subject<void> = new Subject<void>();
  public loading = false;
  public course?: Course;
  public courseForm = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
    author: new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
    }),
  });

  constructor(
    private cdr: ChangeDetectorRef,
    private activeRoute: ActivatedRoute,
    private readonly dataService: DataService
  ) {}

  ngOnInit(): void {
    this.initFormBehavior();
    this.activeRoute.params
      .pipe(takeUntil(this.componentAlive$))
      .subscribe((params: Params) => {
        if (!params.id) {
          this.initNewCourse();
        } else {
          this.loadForm(params.id);
        }
      });
  }

  initFormBehavior(): void {
    this.courseForm.valueChanges.subscribe((data) => {
      console.log('save', data);
      this.loading = true;
      this.cdr.detectChanges();
      if (!this.course || !this.course.id) {
        return;
      }
      this.dataService
        .updateCourse(this.course.id, {
          ...this.course,
          ...data,
        })
        .then((data) => {
          console.log('saved', data);
        }).finally(()=>{
          this.loading = false;
          this.cdr.detectChanges();
      });
    });
  }

  loadForm(courseId: string) {
    this.loading = true;
    this.cdr.detectChanges();
    this.dataService
      .getCoursesById$(courseId)
      .pipe(
        takeUntil(this.componentAlive$),
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe((data: Course | undefined) => {
        if (!data) {
          this.initNewCourse();
          return;
        }
        this.course = data;
        this.courseForm.setValue({ ...data });
        this.cdr.detectChanges();
      });
  }

  initNewCourse(): void {
    //TODO: add new
    console.log('Need init new');
  }

  testUpdate(): void {
    if (!this.course || !this.course.id) {
      return;
    }
    this.dataService.updateCourse(this.course.id, {
      ...this.course,
      name: 'test',
    });
  }

  ngOnDestroy(): void {
    this.componentAlive$.next();
    this.componentAlive$.complete();
  }
}
