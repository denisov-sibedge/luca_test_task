import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject } from 'rxjs';
import {
  debounceTime,
  finalize,
  skip,
  skipWhile,
  takeUntil,
} from 'rxjs/operators';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Course } from '../../models/course.model';
import { DataService } from '../../services/data/data.service';
import { ContentsItem } from '../../models/contents-item.model';
import { Author } from '../../models/author.model';
import { ContentsItemType } from '../../models/contents-item-type.enum';
import { Plan } from '../../models/plan.model';
import { PlanAdvantage } from '../../models/plan-advantage.model';

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
    id: new FormControl(''),
    name: new FormControl(''),
    description: new FormControl(''),
    author: new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
    }),
    coauthors: new FormArray([]),
    contents: new FormArray([]),
    sales: new FormGroup({
      start: new FormControl(),
      end: new FormControl(),
    }),
    duration: new FormGroup({
      value: new FormControl(),
      unit: new FormControl(),
    }),
    plans: new FormArray([]),
  });

  contentsOptions = [
    { label: 'Lesson', value: ContentsItemType.lesson },
    { label: 'Stream', value: ContentsItemType.stream },
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private readonly dataService: DataService
  ) {}

  get coauthors(): FormArray {
    return this.courseForm.get('coauthors') as FormArray;
  }

  get contents(): FormArray {
    return this.courseForm.get('contents') as FormArray;
  }

  get plans(): FormArray {
    return this.courseForm.get('plans') as FormArray;
  }

  advantages(planIndex: number): FormArray {
    return this.plans.controls[planIndex].get('advantages') as FormArray;
  }

  ngOnInit(): void {
    this.activeRoute.params
      .pipe(takeUntil(this.componentAlive$))
      .subscribe((params: Params) => {
        if (!params.id) {
          this.initNewCourse();
        } else {
          this.loadForm(params.id);
        }
        this.initFormBehavior();
      });
  }

  initFormBehavior(): void {
    this.courseForm.valueChanges.pipe(debounceTime(200)).subscribe((data) => {
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
          console.log('saved >> ', data);
        })
        .finally(() => {
          this.loading = false;
          this.cdr.detectChanges();
        });
    });
  }

  loadForm(courseId: string) {
    this.course = this.dataService.getCoursesById(courseId);
    if (!this.course) {
      this.initNewCourse();
      return;
    }
    this.setFormArrays(this.course);

    this.courseForm.patchValue(
      { ...this.course, contents: [], plans: [], coauthors: [] },
      { onlySelf: true, emitEvent: true }
    );
    this.cdr.detectChanges();
  }

  private setFormArrays(course: Course): void {
    this.contents.clear({ emitEvent: false });
    this.coauthors.clear({ emitEvent: false });
    this.plans.clear({ emitEvent: false });
    course.contents?.forEach((content) => this.addContent(content));
    course.coauthors?.forEach((coauthor) => this.addCoAuthor(coauthor));
    course.plans?.forEach((plan) => this.addPlans(plan));
  }

  initNewCourse(): void {
    this.dataService
      .createCourse({})
      .then((data) => {
        this.router.navigate(['editor', data]);
      })
      .finally(() => {
        this.loading = false;
        this.cdr.detectChanges();
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
  removeCoAuthor(coAuthorIndex: number): void {
    this.coauthors.removeAt(coAuthorIndex);
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
  removeContent(contentIndex: number): void {
    this.contents.removeAt(contentIndex);
  }

  addAdvantages(planIndex: number, plan?: PlanAdvantage): void {
    (
      (this.plans.controls[planIndex] as FormGroup).controls
        .advantages as FormArray
    ).push(
      new FormGroup({
        title: new FormControl(''),
        available: new FormControl(false),
      })
    );
  }
  removeAdvantages(planIndex: number, advantagesIndex: number): void {
    (
      (this.plans.controls[planIndex] as FormGroup).controls
        .advantages as FormArray
    ).removeAt(advantagesIndex);
  }

  addPlans(plan?: Plan): void {
    const advantages = new FormArray([]);
    plan?.advantages?.forEach((advantage) => {
      advantages.push(
        new FormGroup({
          title: new FormControl(advantage?.title || ''),
          available: new FormControl(advantage?.available || false),
        })
      );
    });
    const planGroup = new FormGroup({
      name: new FormControl(plan?.name || ''),
      price: new FormControl(plan?.price || 0),
      advantages,
    });
    this.plans.push(planGroup);
  }

  removePlans(planIndex: number): void {
    this.plans.removeAt(planIndex);
  }

  ngOnDestroy(): void {
    this.componentAlive$.next();
    this.componentAlive$.complete();
  }
}
