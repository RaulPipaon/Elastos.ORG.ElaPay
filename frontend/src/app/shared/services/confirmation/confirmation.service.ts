import { Injectable } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationComponent } from '../../components/confirmation/confirmation.component';

@Injectable()
export class ConfirmationService {
    constructor(private modalService: NgbModal) {}

    confirm(data) {
        return new Promise((resolve) => {
            const modalRef = this.modalService.open(ConfirmationComponent);
            modalRef.componentInstance.data = data;

            modalRef.result.then((result: boolean) => {
                resolve(result);
            }, (err) => {
                // We treat case error as cancel request
                resolve(false);
            });
        });
    }
}
