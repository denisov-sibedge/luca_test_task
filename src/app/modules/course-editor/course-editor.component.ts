import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subject } from 'rxjs';
import { finalize, skip, skipWhile, takeUntil } from 'rxjs/operators';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Course } from '../../models/course.model';
import { DataService } from '../../services/data/data.service';
import { ContentsItem } from '../../models/contents-item.model';
import { Author } from '../../models/author.model';
import { ContentsItemType } from '../../models/contents-item-type.enum';
import { DurationUnit } from '../../models/duration-unit.enum';

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
    coauthors: new FormArray([]),
    contents: new FormArray([]),
  });

  contentsOptions = [
    { label: 'Lesson', value: ContentsItemType.lesson },
    { label: 'Stream', value: ContentsItemType.stream },
  ];
  durationOptions = [
    { label: 'Day', value: DurationUnit.day },
    { label: 'Hour', value: DurationUnit.hour },
    { label: 'Week', value: DurationUnit.week },
    { label: 'Month', value: DurationUnit.month },
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private activeRoute: ActivatedRoute,
    private readonly dataService: DataService
  ) {}

  get coauthors(): FormArray {
    return this.courseForm.get('coauthors') as FormArray;
  }

  get contents(): FormArray {
    return this.courseForm.get('contents') as FormArray;
  }

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
    this.courseForm.valueChanges
      .pipe(skipWhile(() => this.loading))
      .subscribe((data) => {
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
          })
          .finally(() => {
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
        this.setFormArrays(data);
        this.courseForm.patchValue({ ...data, contents: [] });
        this.cdr.detectChanges();
      });
  }

  private setFormArrays(course: Course): void {
    course.contents?.forEach((content) => this.addContent(content));
    course.coauthors?.forEach((coauthor) => this.addCoAuthor(coauthor));
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

  addCoAuthor(author?: Author): void {
    this.coauthors.push(
      new FormGroup({
        firstName: new FormControl(author?.firstName || ''),
        lastName: new FormControl(author?.lastName || ''),
      })
    );
  }

  addContent(content?: ContentsItem): void {
    this.contents.push(
      new FormGroup({
        name: new FormControl(content?.name || ''),
        duration: new FormGroup({
          value: new FormControl(content?.duration?.value),
          unit: new FormControl(content?.duration?.unit),
        }),
        type: new FormControl(content?.type || ''),
      })

    );
  }

  ngOnDestroy(): void {
    this.componentAlive$.next();
    this.componentAlive$.complete();
  }
}
