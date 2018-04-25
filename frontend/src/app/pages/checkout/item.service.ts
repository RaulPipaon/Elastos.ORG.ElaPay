import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

@Injectable()
export class ItemService {
    constructor(private http: HttpClient) {}

    find(id: string): Observable<any> {
        return this.http.get<any>(`${SERVER_API_URL}api/order/${id}`, {
            observe: 'response'
        }).map((data) => {
            return data.body;
        });
    }
}
