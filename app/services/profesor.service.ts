import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from "src/environments/environment";
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ProfesorService {

  base_url: string = environment.API_URL;

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) { }

  configHeaders() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return headers;
  }

  getAll(body: any, token = false): Promise<any> {
    let headers = this.configHeaders();
    if(token) {
      let localStorage: any = this.localStorageService.getData();
      headers = headers.set('Authorization', localStorage.token);
    }
    return lastValueFrom(this.http.post<any>(`${this.base_url}/api/public/profesores/getSearch`, body,{ headers }));
  }

  getAllPrivate(body: any): Promise<any> {
    let localStorage: any = this.localStorageService.getData();
    let headers = this.configHeaders();
    headers = headers.set('Authorization', localStorage.token);
    return lastValueFrom(this.http.post<any>(`${this.base_url}/api/private/profesores/getSearch`, body,{ headers }));
  }

  validate(profesorId: number) {
    let localStorage: any = this.localStorageService.getData();
    let headers = this.configHeaders();
    headers = headers.set('Authorization', localStorage.token);
    return lastValueFrom(this.http.put<any>(`${this.base_url}/api/private/profesores/validate/${profesorId}`, {}, { headers }));
  }

  lock(profesorId: number) {
    let localStorage: any = this.localStorageService.getData();
    let headers = this.configHeaders();
    headers = headers.set('Authorization', localStorage.token);
    return lastValueFrom(this.http.put<any>(`${this.base_url}/api/private/profesores/lock/${profesorId}`, {}, { headers }));
  }

}
