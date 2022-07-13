import {
  Directive,
  ElementRef,
  HostListener,
  Renderer2,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: 'input[type=date][ngModel], input[type=date][formControl], input[type=date][formControlName]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateInputConverterDirective),
      multi: true,
    },
  ],
})
export class DateInputConverterDirective implements ControlValueAccessor {
  @HostListener('blur', []) onTouched: any = () => {};
  @HostListener('input', ['$event']) onChange: any = () => {};

  private valueType: 'value' | 'valueAsDate' = 'value';

  constructor(private renderer: Renderer2, private elementRef: ElementRef) {
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  registerOnChange(fn: (value: any) => void) {
    this.onChange = (event: any) => fn(event.target[this.valueType]);
  }

  writeValue(value: Date | string) {
    this.valueType = typeof value === 'string' ? 'value' : 'valueAsDate';
    this.renderer.setProperty(
      this.elementRef.nativeElement,
      this.valueType,
      value
    );
  }
}
