import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CricketDataService {

constructor(private http: HttpClient) { }

getSeriesList(){
  return this.http.get(`${environment.api_url}v1/home/series`)
}

getUpcomingMatches() {
  return this.http.get(`${environment.api_url}v1/home/upcomingMatches`)
}

getRecentMatches() {
  return this.http.get(`${environment.api_url}v1/home/recentMatches`)
}

getUndeclaredResult() {
  return this.http.get(`${environment.api_url}v1/quiz/get_no_of_users_answered`)
}

}
