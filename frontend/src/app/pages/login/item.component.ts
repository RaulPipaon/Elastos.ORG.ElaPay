import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { JhiEventManager } from 'ng-jhipster';
import { LoginService, NotificationService, Principal } from '../../shared';

@Component({
    selector: 'jhi-login',
    templateUrl: './item.component.html'
})
export class ItemComponent {
    item: any = {
        username: null,
        password: null,
        rememberMe: true
    };

    constructor(
        private loginService: LoginService,
        private eventManager: JhiEventManager,
        private router: Router,
        private notificationService: NotificationService,
        private principal: Principal,
    ) {
    }

    actionSave() {
        this.loginService.login(this.item).then((isSuccess) => {
            console.log('isSuccess', isSuccess);

            if (isSuccess) {
                // Fire event and redirect to homepage
                this.eventManager.broadcast({
                    name: 'authenticationSuccess',
                    content: 'Sending Authentication Success'
                });

                this.notificationService.successByKey('login.loginSuccess');
                this.processRedirectUser();
            } else {
                this.notificationService.errorByKey('login.loginFailed');
            }
        }).catch((err) => {
            if (err && (err.status === 401 || err.status === 400)) {
                this.notificationService.errorByKey('login.loginFailed');
            } else {
                this.notificationService.errorByKey('login.errorWhileLogin');
            }
        });
    }

    processRedirectUser() {
        this.principal.identity().then((account) => {
            if (!account) {
                return;
            }

            const ROLE_STAFF = 'ROLE_STAFF';
            const ROLE_ADMIN = 'ROLE_ADMIN';

            if (account.authorities.indexOf(ROLE_STAFF) !== -1) {
                this.router.navigate(['/select-counter-and-services']);
            } else if (account.authorities.indexOf(ROLE_ADMIN) !== -1) {
                this.router.navigate(['/']);
            }
        });
    }
}
