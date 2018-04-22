import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { WebClientItemModule as LoginModule } from './login/item.module';
import { WebClientItemModule as HomeModule } from './home/item.module';
import { WebClientItemModule as CheckoutModule } from './checkout/item.module';

@NgModule({
    imports: [
        HomeModule,
        CheckoutModule,
        LoginModule,
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WebClientPageModule {
}
