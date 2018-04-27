import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JhiEventManager } from 'ng-jhipster';
import * as moment from 'moment';
import { ItemService } from './item.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'jhi-home',
    templateUrl: './item.component.html',
    styleUrls: [
        './item.component.styl'
    ]
})
export class ItemComponent implements OnInit, OnDestroy {
    item: any;
    private subscription: Subscription;

    constructor(
        private itemService: ItemService,
        private eventManager: JhiEventManager,
        private router: Router,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.loadOrder(params['id']);
        });
    }

    loadOrder(id) {
        this.itemService.find(id).subscribe((order: any) => {
            this.item = order.order;
            this.item.elaAmount = Number(this.item.elaAmount).toFixed(5);
        });
    }

    handleClickPay() {
        window.location.href = 'https://wallet.elastos.org';
    }

    handleClickClose() {
        window.location.href = this.item.returnUrl || '/';
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
