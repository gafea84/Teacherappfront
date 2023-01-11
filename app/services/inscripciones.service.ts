import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class InscripcionesService {

  base_url: string = environment.API_URL;

  constructor(
    private localStorageService: LocalStorageService,
    private http: HttpClient
  ) { }

  configHeaders() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return headers;
  }

  inscribirAlumno(profesorId: number): Promise<any> {
    let headers = this.configHeaders();
    let localStorage: any = this.localStorageService.getData();
    headers = headers.set('Authorization', localStorage.token);
    return lastValueFrom(this.http.post<any>(`${this.base_url}/api/private/inscripciones/signup/${profesorId}`, {},{ headers }));
  }
  
  getInscripcionesAlumno(body = {}): Promise<any> {
    let headers = this.configHeaders();
    let localStorage: any = this.localStorageService.getData();
    headers = headers.set('Authorization', localStorage.token);
    return lastValueFrom(this.http.post<any>(`${this.base_url}/api/private/inscripciones/alumnos/getSearch`, body,{ headers }));
  }

  getInscripcionesProfesor(body = {}): Promise<any> {
    let headers = this.configHeaders();
    let localStorage: any = this.localStorageService.getData();
    headers = headers.set('Authorization', localStorage.token);
    return lastValueFrom(this.http.post<any>(`${this.base_url}/api/private/inscripciones/profesores/getSearch`, body,{ headers }));
  }

}
