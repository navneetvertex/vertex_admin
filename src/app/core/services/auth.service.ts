import { Injectable } from '@angular/core';

import { getFirebaseBackend } from '../../authUtils';
import { map } from 'rxjs/operators';
import { User } from '../models/auth.models';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })

export class AuthenticationService {

    user: User;
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(email_id: string, password: string) {
        return this.http.post<any>(`${environment.api_url}auth/login`, { email_id, password }, { withCredentials: true })
            .pipe(map(user => {
                if (user && user.accessToken) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    localStorage.setItem('token', user.accessToken);
                    this.currentUserSubject.next(user);
                }
                return user;
            }));
    }

    updateAccessToken(newToken: string, user: any = this.currentUserValue) {
        user.accessToken = newToken;
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('token', newToken);
        this.currentUserSubject.next(user);
    }

    refreshToken() {
        return this.http.post<any>(`${environment.api_url}auth/refresh-token`, {}, { withCredentials: true });
    }

    logout() {
        return this.http.get<any>(`${environment.api_url}auth/logout`, { withCredentials: true })
            .pipe(map(user => {
                 localStorage.clear()
                localStorage.removeItem('currentUser');
                this.currentUserSubject.next(null);
                return false;
            }));
    }
}

