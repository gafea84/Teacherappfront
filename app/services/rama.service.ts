import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RamaService {

  constructor(
    private http: HttpClient
  ) { }

  base_url: string = environment.API_URL;

  configHeaders() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return headers;
  }

  getAll(): Promise<any> {
    let headers = this.configHeaders();
    return lastValueFrom(this.http.get<any>(`${this.base_url}/api/public/ramas`, { headers }));
  }
  
}
