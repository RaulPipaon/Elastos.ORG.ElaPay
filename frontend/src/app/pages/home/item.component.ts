import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JhiEventManager } from 'ng-jhipster';
import * as moment from 'moment';
import { ItemService } from './item.service';

@Component({
    selector: 'jhi-home',
    templateUrl: './item.component.html',
    styleUrls: [
        './item.component.styl'
    ]
})
export class ItemComponent implements OnInit, OnDestroy {
    item: any;

    constructor(
        private itemService: ItemService,
        private eventManager: JhiEventManager,
        private router: Router,
    ) {
    }

    ngOnInit() {
        this.item = {
            date: moment().toISOString(),
            name: 'Order name',
            description: 'Order description',
            businessName: 'Business name',
            orderId: 'Order ID',
            cashEla: '0.00',
            cashUsd: '0.00',
        };
    }

    handleClickPay() {
        alert('TODO handleClickPay');
    }

    handleClickClose() {
        alert('TODO handleClickClose');
    }

    ngOnDestroy() {
    }
}
