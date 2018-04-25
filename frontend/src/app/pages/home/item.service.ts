import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

@Injectable()
export class ItemService {
    constructor(private http: HttpClient) {}

    save(item: any): Observable<any> {
        return this.http.post(`${SERVER_API_URL}api/order`, item);
    }
}
