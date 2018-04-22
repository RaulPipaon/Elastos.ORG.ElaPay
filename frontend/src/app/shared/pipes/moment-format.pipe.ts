import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name: 'momentFormatPipe'
})
export class MomentFormatPipe implements PipeTransform {
    transform(inputTime: any, targetFormat): any {
        if (inputTime) {
            return moment(inputTime).format(targetFormat).valueOf();
        }
    }
}
