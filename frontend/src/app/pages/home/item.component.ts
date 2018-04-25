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
            orderName: 'Order name',
            orderDesc: 'Order description',
            orderId: '',
            businessName: 'Business name',
            currency: 'ELA',
            price: 10,
            currencyCode: 'ELA',
            rateAdjustment: '',
            callbackUrl: '',
            returnUrl: '',
            email: ''
        };
    }

    handleClickPay() {
        alert('TODO handleClickPay');
    }

    checkout() {
        this.itemService.save(this.item).subscribe((data) => {
            console.log('data', data);
            this.router.navigate(['/checkout']);
        }, (err) => {
            console.log('err', err);
        });
    }

    handleClickClose() {
        alert('TODO handleClickClose');
    }

    ngOnDestroy() {
    }
}
