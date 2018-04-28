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
        let price = this.item.price;
        let currency = this.item.currency;

        if (this.item.currency === 'CNY/RMB') {
            currency = 'CNY';
        }

        if (this.state.discountPecent) {
            if (this.state.discountPecent > 100 || this.state.discountPecent < 0) {
                return alert('Error: Discount percent must between from 0% to 100%');
            }

            price = price * (1 - this.state.discountPecent / 100);
        }

        this.itemService.getRateWithCurrency(currency, price).subscribe((data: any) => {

            if (data.status === 'Not Success') {
                return alert('Error get rate currency');
            }

            this.saveRateAdjustments(data);
            this.save();
        });
    }

    saveRateAdjustments(data) {
        this.item.elaAmount = data.elaAmount;
        this.item.exchangeRate = data.exchangeRate;
        this.item.queryTime = data.queryTime;
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
