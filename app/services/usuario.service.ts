import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from './local-storage.service';
import Swal from'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

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

  getInfoUser(): Promise<any> {
    let headers = this.configHeaders();
    let localStorage: any = this.localStorageService.getData();
    headers = headers.set('Authorization', localStorage.token);
    return lastValueFrom(this.http.get<any>(`${this.base_url}/api/private/usuarios/mydata`, { headers }));
  }

  changePasswordUser(password: string) {
    let headers = this.configHeaders();
    let localStorage: any = this.localStorageService.getData();
    headers = headers.set('Authorization', localStorage.token);
    return lastValueFrom(this.http.put<any>(`${this.base_url}/api/private/usuarios/update/password`, { password }, { headers }));
  }

  changeImageUser(imagen: any) {
    let headers = new HttpHeaders();
    let localStorage: any = this.localStorageService.getData();
    headers = headers.set('Authorization', localStorage.token);
    return lastValueFrom(this.http.put<any>(`${this.base_url}/api/private/usuarios/update/imagen`, imagen, { headers }));
  }

  gestion_de_errores_cambiar_contra(err:any):void{
    if(err.status){
      if(err.status==400){
        Swal.fire('', 'Alguno de los campos enviados es incorrecto', 'error');
      }
      else if(err.status==500){
        Swal.fire('', 'Se ha producido algún error en el servidor', 'error');
      }
      else{
        Swal.fire('', 'Se ha producido algun tipo de error', 'error');
      }
    }
    else{
      Swal.fire('', 'Se ha producido algun tipo de error', 'error');
    }
  }
  gestion_de_errores_cambiar_imagen(err:any):void{
    if(err.status){
      if(err.status==400){
        Swal.fire('', 'El fichero es demasiado grande, o su extensión no corresponde a una imagen', 'error');
      }
      else if(err.status==500){
        Swal.fire('', 'Se ha producido algún error en el servidor', 'error');
      }
      else{
        Swal.fire('', 'Se ha producido algun tipo de error', 'error');
      }
    }
    else{
      Swal.fire('', 'Se ha producido algun tipo de error', 'error');
    }
  }
}
