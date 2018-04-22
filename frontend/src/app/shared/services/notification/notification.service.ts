import { Injectable } from '@angular/core';
import * as toastr from 'toastr';
import { CONFIG } from '../../config';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class NotificationService {
    constructor(private translateService: TranslateService) {}

    success(translatedText: string) {
        toastr.info(translatedText, null, CONFIG.notification.info);
    }

    successByKey(translatedKey: string, params?: any) {
        this.translateService.get(translatedKey, params).subscribe((translatedText: string) => {
            this.success(translatedText);
        });
    }

    error(translatedText: string) {
        toastr.warning(translatedText, null, CONFIG.notification.warning);
    }

    errorByKey(translatedKey: string, params?: any) {
        this.translateService.get(translatedKey, params).subscribe((translatedText: string) => {
            this.error(translatedText);
        });
    }
}
