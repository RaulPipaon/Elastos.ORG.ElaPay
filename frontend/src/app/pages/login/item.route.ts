import { Routes } from '@angular/router';
// import { UserRouteAccessService } from '../../shared';
import { ItemComponent } from './item.component';

export const itemRoute: Routes = [
    {
        path: 'login',
        component: ItemComponent,
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'login.screenTitle'
        },
        // canActivate: [UserRouteAccessService]
    }
];
