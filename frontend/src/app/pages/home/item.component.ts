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
    state: any;

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
            businessName: '',
            currency: 'USD',
            callbackUrl: '',
            returnUrl: '',
            email: '',
            price: null,
            walletAddress: ''
        };

        this.state = {
            discountPecent: null
        };
    }

    checkout() {
        this.isSaving = true;
        let currency = this.item.currency;

        if (this.item.currency === 'CNY/RMB') {
            currency = 'CNY';
        }

        this.itemService.getRateWithCurrency(currency, this.item.price).subscribe((data: any) => {

            if (data.status === 'Not Success') {
                return alert('Error get rate currency');
            }

            this.saveRateAdjustments(data);
            this.save();
        });
    }

    saveRateAdjustments(data) {
        let elaAmount = data.elaAmount;
        let exchangeRate = data.exchangeRate;
        this.item.queryTime = data.queryTime;

        if (this.state.discountPecent) {
            const rate = this.state.discountPecent / 100;

            elaAmount = elaAmount - (elaAmount * rate);
            exchangeRate = exchangeRate - (exchangeRate * rate);
        }

        this.item.elaAmount = Math.round(parseFloat(elaAmount) * 100000000) / 100000000;
        this.item.exchangeRate = exchangeRate;
    }

    save() {
        this.itemService.save(this.item).subscribe((data) => {
            this.isSaving = false;
            this.router.navigate([`/checkout/${data.order._id}`]);
        }, (err) => {
            this.isSaving = false;
            return alert(err.error.error);
        });
    }

    selectedCurrency() {
        if (this.item.currency === 'ELA') {
            return this.isElaCurrency = true;
        }

        this.isElaCurrency = false;
    }

    ngOnDestroy() {
    }
}
