import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class UserProfileService {
    constructor(private http: HttpClient) { }

    getAllUsers(page: number = 0, limit: number = 10) {
        return this.http.get(`${environment.api_url}users?page=${page}&limit=${limit}`);
    }

    changeUserStatus(userId: string, status: string) {
        return this.http.put(`${environment.api_url}users/changeStatus/${userId}`, { status });
    }

    sendNotification(userId: string, title: string, message: string) {
        return this.http.post(`${environment.api_url}users/sendNotification`, { title, message, userId });
    }

    upsertKyc(kycData: any) {
        return this.http.post(`${environment.api_url}users/kyc`, kycData);
    }

    updateProfile(profileData: any) {
        return this.http.put(`${environment.api_url}users/profile`, profileData);
    }

    createBank(bankData: any) {
        return this.http.post(`${environment.api_url}users/bank`, bankData);
    }

    createAddress(addressData: any) {
        return this.http.post(`${environment.api_url}users/address`, addressData);
    }

    getUserById(userId: string) {
        return this.http.get(`${environment.api_url}users/${userId}`);
    }

    getAllUserIds() {
        return this.http.get(`${environment.api_url}users/getAllUserId/all`);
    }

    
}
