import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { WebClientItemModule as LoginModule } from './login/item.module';
import { WebClientItemModule as HomeModule } from './home/item.module';

@NgModule({
    imports: [
        HomeModule,
        LoginModule,
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WebClientPageModule {
}
