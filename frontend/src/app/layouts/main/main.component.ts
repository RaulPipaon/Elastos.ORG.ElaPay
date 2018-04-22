import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRouteSnapshot, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { JhiLanguageHelper } from '../../shared';
import { CONFIG } from '../../shared/config';
import * as $ from 'jquery';

@Component({
    selector: 'jhi-main',
    templateUrl: './main.component.html',
    styleUrls: [
        './main.component.styl'
    ],
    encapsulation: ViewEncapsulation.None
})
export class JhiMainComponent implements OnInit {
    private currentPageTitleKey: string;

    constructor(
        private jhiLanguageHelper: JhiLanguageHelper,
        private router: Router,
        private translateService: TranslateService,
    ) {}

    private getPageTitle(routeSnapshot: ActivatedRouteSnapshot) {
        let title: string = (routeSnapshot.data && routeSnapshot.data['pageTitle']) ? routeSnapshot.data['pageTitle'] : 'webClientApp';
        if (routeSnapshot.firstChild) {
            title = this.getPageTitle(routeSnapshot.firstChild) || title;
        }
        return title;
    }

    ngOnInit() {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.currentPageTitleKey = this.getPageTitle(this.router.routerState.snapshot.root);
                this.jhiLanguageHelper.updateTitle(this.currentPageTitleKey);
            }
        });
    }
}
