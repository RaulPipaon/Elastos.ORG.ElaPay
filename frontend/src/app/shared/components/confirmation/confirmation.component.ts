import {Component, Input} from '@angular/core';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'jhi-confirmation',
    templateUrl: './confirmation.component.html'
})
export class ConfirmationComponent {
    data: any;

    constructor(public activeModal: NgbActiveModal) {}
}
