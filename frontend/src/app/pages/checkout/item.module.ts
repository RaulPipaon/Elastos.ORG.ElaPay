import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { WebClientSharedModule } from '../../shared';
import { ItemComponent, itemRoute, ItemService, } from './';

const ENTITY_STATES = [
    ...itemRoute,
];

@NgModule({
    imports: [
        WebClientSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        ItemComponent,
    ],
    entryComponents: [
        ItemComponent,
    ],
    providers: [
        ItemService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WebClientItemModule {
}
