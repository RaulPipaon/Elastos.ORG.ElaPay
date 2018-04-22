import { Injectable, Component } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class PopupService {
    constructor(
        private modalService: NgbModal,
    ) {
    }

    openComponent(component: Component, data, config?) {
        return this.shopModalRef(component, data, config);
    }

    private shopModalRef(component: Component, data: any, config?): NgbModalRef {
        const defaultModalConfig: any = {
            size: 'lg',
            backdrop: 'static'
        };

        const mergeConfig = Object.assign(defaultModalConfig, config);
        const modalRef = this.modalService.open(component, mergeConfig);
        modalRef.componentInstance.data = data;

        return modalRef;
    }
}
