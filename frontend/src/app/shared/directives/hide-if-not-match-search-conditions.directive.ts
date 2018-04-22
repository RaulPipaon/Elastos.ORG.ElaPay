import { Directive, ElementRef, Input, OnInit, HostListener, OnChanges } from '@angular/core';
import * as $ from 'jquery';

@Directive({
    selector: '[jhiHideIfNotMatchSearchConditions]'
})
export class HideIfNotMatchSearchConditionsDirective implements OnInit, OnChanges {
    @Input() filterData;

    constructor(private el: ElementRef) {
    }

    ngOnInit() {
    }

    @HostListener('change') ngOnChanges() {
        if (!this.filterData) {
            return;
        }

        let shouldHide = false;
        for (const key in this.filterData.search) {
            if (!this.filterData.search.hasOwnProperty(key)) {
                continue;
            }

            if (this.filterData.search[key] === null) {
                continue;
            }

            if (typeof this.filterData.item[key] === 'boolean') {
                // Case field search choose true/false
                if (this.filterData.item[key] !== this.filterData.search[key]) {
                    shouldHide = true;
                }
            } else {
                // Case field is input text
                if (this.filterData.item[key].indexOf(this.filterData.search[key]) === -1) {
                    shouldHide = true;
                }
            }
        }

        if (shouldHide) {
            $(this.el.nativeElement).css('display', 'none');
        } else {
            $(this.el.nativeElement).css('display', '');
        }
    }
}
