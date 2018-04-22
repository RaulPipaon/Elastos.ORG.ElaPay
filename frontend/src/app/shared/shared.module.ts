import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DatePipe } from '@angular/common';

import {
    WebClientSharedLibsModule,
    WebClientSharedCommonModule,
    CSRFService,
    AuthServerProvider,
    AccountService,
    UserService,
    StateStorageService,
    LoginService,
    LoginModalService,
    JhiLoginModalComponent,
    Principal,
    HasAnyAuthorityDirective,

    ConfirmationService,
    PopupService,
    LoggerService,
    NotificationService,

    HideIfNotMatchSearchConditionsDirective,

    MomentFormatPipe,

    ConfirmationComponent,
} from './';

@NgModule({
    imports: [
        WebClientSharedLibsModule,
        WebClientSharedCommonModule
    ],
    declarations: [
        JhiLoginModalComponent,
        HasAnyAuthorityDirective,

        HideIfNotMatchSearchConditionsDirective,

        MomentFormatPipe,

        ConfirmationComponent,
    ],
    providers: [
        LoginService,
        LoginModalService,
        AccountService,
        StateStorageService,
        Principal,
        CSRFService,
        AuthServerProvider,
        UserService,
        DatePipe,

        ConfirmationService,
        PopupService,
        LoggerService,
        NotificationService,
    ],
    entryComponents: [
        JhiLoginModalComponent,

        ConfirmationComponent,
    ],
    exports: [
        WebClientSharedCommonModule,
        JhiLoginModalComponent,
        HasAnyAuthorityDirective,
        DatePipe,

        HideIfNotMatchSearchConditionsDirective,

        MomentFormatPipe,

        ConfirmationComponent,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class WebClientSharedModule {}
