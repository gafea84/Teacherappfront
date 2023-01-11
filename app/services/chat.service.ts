import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { environment } from 'src/environments/environment';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

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

  getMessages(): Promise<any> {
    let headers = this.configHeaders();
    let localStorage: any = this.localStorageService.getData();
    headers = headers.set('Authorization', localStorage.token);
    return lastValueFrom(this.http.get<any>(`${this.base_url}/api/private/mensajes/allmessages`, { headers }));
  }

  sendMessage(message: any): Promise<any> {
    let headers = this.configHeaders();
    let localStorage: any = this.localStorageService.getData();
    headers = headers.set('Authorization', localStorage.token);
    return lastValueFrom(this.http.post<any>(`${this.base_url}/api/private/mensajes/send`, message, { headers }));
  }

  setReadMessage(messageId: number) {
    let headers = this.configHeaders();
    let localStorage: any = this.localStorageService.getData();
    headers = headers.set('Authorization', localStorage.token);
    return lastValueFrom(this.http.put<any>(`${this.base_url}/api/private/mensajes/setread/${messageId}`, {}, { headers }));
  }

}
