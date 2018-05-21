import {
  Directive,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  DoCheck,
  OnDestroy,
  KeyValueDiffers,
  KeyValueDiffer
} from '@angular/core';
import $ from 'jquery';
import 'bootstrap-daterangepicker';

@Directive({
  selector: '[appInputDateRange]'
})
export default class NgxInputDateRangeDirective implements DoCheck, OnDestroy {
  @Output() public selectedDateRange = new EventEmitter<any>();
  @Output() public showDateRangePicker = new EventEmitter<any>();
  @Output() public hideDateRangePicker = new EventEmitter<any>();
  @Output() public showCalendarDateRangePicker = new EventEmitter<any>();
  @Output() public hideCalendarDateRangePicker = new EventEmitter<any>();
  @Output() public applyDateRangePicker = new EventEmitter<any>();
  @Output() public cancelDateRangePicker = new EventEmitter<any>();
  private _options: { [key: string]: any };
  private _differ: KeyValueDiffer<string, any>;
  private _dateRangeDom: any = null;
  private _currentDateRange: any = {};
  private _chineseConfig: any = {
    applyLabel: '确定',
    cancelLabel: '取消',
    customRangeLabel: '自定义',
    daysOfWeek: [
      '日', '一', '二', '三', '四', '五', '六'
    ],
    monthNames: [
      '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'
    ]
  };

  constructor (private _elementRef: ElementRef,
               private _differs: KeyValueDiffers) {
  }
  @Input()
  set options (v: {[key: string]: any}) {
    this._options = v;
    if (!this._differ && v) {
      this._differ = this._differs.find(v).create();
    }
  }
  ngDoCheck () {
    if (this._differ) {
      const changes = this._differ.diff(this._options);

      if (changes) {
        this._dateRangeDom = this._createDateRange();
        this._bindDateRangeEvents(this._dateRangeDom);
        const dateRangeConfig = this._dateRangeDom.data('daterangepicker');
        dateRangeConfig.setStartDate(this._currentDateRange.start);
        dateRangeConfig.setEndDate(this._currentDateRange.end);
      }
    }
  }
  ngOnDestroy () {
    if (this._dateRangeDom && this._dateRangeDom.data('daterangepicker')) {
      this._dateRangeDom.data('daterangepicker').remove();
    }
  }
  private _getCurrentDateRange (start, end, label) {
    this._currentDateRange = { start, end, label };
    this.selectedDateRange.emit(this._currentDateRange);
  }
  private _bindDateRangeEvents (jqueryDom) {
    jqueryDom.on('show.daterangepicker', (ev, picker) => {
      this.showDateRangePicker.emit({ ev, picker });
    });
    jqueryDom.on('hide.daterangepicker', (ev, picker) => {
      this.hideDateRangePicker.emit({ ev, picker });
    });
    jqueryDom.on('showCalendar.daterangepicker', (ev, picker) => {
      this.showCalendarDateRangePicker.emit({ ev, picker });
    });
    jqueryDom.on('hideCalendarDateRangePicker', (ev, picker) => {
      this.hideCalendarDateRangePicker.emit({ ev, picker });
    });
    jqueryDom.on('apply.daterangepicker', (ev, picker) => {
      this.applyDateRangePicker.emit({ ev, picker });
    });
    jqueryDom.on('cancel.daterangepicker', (ev, picker) => {
      this.cancelDateRangePicker.emit({ ev, picker });
    });
  }
  private _createDateRange () {
    const assignConfig = Object.assign({}, this.options, {
      locale: this._chineseConfig
    });
    const jqueryDom = $(this._elementRef.nativeElement);
    jqueryDom.daterangepicker(assignConfig, this._getCurrentDateRange.bind(this));
    return jqueryDom;
  }
}
