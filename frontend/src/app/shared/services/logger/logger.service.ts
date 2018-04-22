import { Injectable } from '@angular/core';

import * as Raven from 'raven-js';

@Injectable()
export class LoggerService {
    static logError(err) {
        return Raven.captureException(err.originalError || err);
    }

    constructor(
    ) {
    }
}
