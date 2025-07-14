import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

constructor(private http: HttpClient) { }

private settingsSubject = new BehaviorSubject<any>(null);

memberFees(payload: any) {
  return this.http.post(`${environment.api_url}settings/member-fees`, payload);
}

getMemberFees() {
  return this.http.get(`${environment.api_url}settings/member-fees`);
}

upsertGeneralSettings(payload: any) {
  return this.http.post(`${environment.api_url}settings/general-settings`, payload).pipe(
      tap((res: any) => this.settingsSubject.next(res.data.generalSettings)));
}

getGeneralSettings() {
  return this.http.get(`${environment.api_url}settings/general-settings`);
}

loadGeneralSettings(): Observable<any> {
  if (this.settingsSubject.value) {
    return of(this.settingsSubject.value);
  }
  return this.http.get<any>(`${environment.api_url}settings/general-settings`).pipe(
    tap(res => this.settingsSubject.next(res.data.generalSettings))
  );
}

getGeneralSettings$(): Observable<any> {
  return this.settingsSubject.asObservable();
}



}
