import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom, firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class PerfilAlumnosService {

  baseURL:string=environment.API_URL+"/api/private/inscripciones/alumnos/getSearch";
  baseURL1:string=environment.API_URL+"/api/private/usuarios/mydata";
  baseURL2:string=environment.API_URL+"/api/public/alumnos/register";
  baseURL3:string=environment.API_URL+"/api/private/alumnos/update";
  baseURL4:string=environment.API_URL+"/api/private/inscripciones/opinion";
  constructor(private httpClient:HttpClient) { }

  profesores(token:any):Promise<any>{
    if(token==null){
      token="";
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': token
      })
    }
    return lastValueFrom(this.httpClient.post(this.baseURL, {} ,httpOptions));
  }
  datos(token:any):Promise<any>{
    if(token==null){
      token="";
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': token
      })
    }
    return lastValueFrom(this.httpClient.get(this.baseURL1, httpOptions));
  }
  crear_alumno(datos:any):Promise<any>{
    if(datos==null){
      datos="";
    }
    return lastValueFrom(this.httpClient.post(this.baseURL2,datos));
  }
  mod_datos(datos:any,token:any):Promise<any>{
    if(datos==null){
      datos="";
    }
    if(token==null){
      token="";
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': token
      })
    }
    return lastValueFrom(this.httpClient.put(this.baseURL3,datos,httpOptions));
  }
  opinar(datos:any,token:any):Promise<any>{
    if(datos==null){
      datos="";
    }
    if(token==null){
      token="";
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': token
      })
    }
    return lastValueFrom(this.httpClient.put(this.baseURL4,datos,httpOptions));
  }
  gestion_de_errores_datos_alumnos(err:any):void{
    if(err.status){
      if(err.status==404){
        Swal.fire('', 'No se pudo recuperar el usuario', 'error');
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
  gestion_de_errores_opiniones(err:any):void{
    if(err.status){
      if(err.status==401){
        Swal.fire('', 'La inscripción pertenece a otro alumno', 'error');
      }
      else if(err.status==404){
        Swal.fire('', 'La inscripción pertenece a otro alumno', 'error');
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
  gestion_de_errores_profesores(err:any):void{
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
}