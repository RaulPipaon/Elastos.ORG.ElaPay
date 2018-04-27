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
    currencies = [
        'CNY/RMB',
        'INR',
        'JPY',
        'USD',
        // 'ELA'
    ];
    isElaCurrency = false;
    isSaving = false;

    constructor(
        private itemService: ItemService,
        private eventManager: JhiEventManager,
        private router: Router,
    ) {
    }

    ngOnInit() {

        this.item = {
            date: moment().toISOString(),
            orderName: '',
            orderDesc: '',
            elaAmount: null,
            exchangeRate: null,
            queryTime: null,
            orderId: '',
            businessName: '',
            currency: 'USD',
            callbackUrl: '',
            returnUrl: '',
            email: '',
            price: null,
            walletAddress: ''
        };
    }

    handleClickPay() {
        alert('TODO handleClickPay');
    }

    checkout() {
        this.isSaving = true;
        this.itemService.getRateWithCurrency(this.item.currency, this.item.price).subscribe((data: any) => {
            this.item.elaAmount = data.elaAmount;
            this.item.exchangeRate = data.exchangeRate;
            this.item.queryTime = data.queryTime;

            this.save();
        });
    }

    save() {
        this.itemService.save(this.item).subscribe((data) => {
            console.log('data', data);
            this.isSaving = false;
            this.router.navigate([`/checkout/${data.order._id}`]);
        }, (err) => {
            this.isSaving = false;
            console.log('err', err);
        });
    }

    selectedCurrency() {
        if (this.item.currency === 'ELA') {
            return this.isElaCurrency = true;
        }

        this.isElaCurrency = false;
    }

    handleClickClose() {
        alert('TODO handleClickClose');
    }

    ngOnDestroy() {
    }
}
