import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom, firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class PerfilProfesService {

  baseURL:string=environment.API_URL+"/api/private/inscripciones/profesores/getSearch";
  baseURL1:string=environment.API_URL+"/api/private/usuarios/mydata";
  baseURL2:string=environment.API_URL+"/api/private/profesores/update";
  baseURL3:string=environment.API_URL+"/api/private/inscripciones/accept/";
  baseURL4:string=environment.API_URL+"/api/public/profesores/register";
  constructor(private httpClient:HttpClient) { }

  alumnos(token:any):Promise<any>{
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
    return lastValueFrom(this.httpClient.get(this.baseURL1,httpOptions));
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
    return lastValueFrom(this.httpClient.put(this.baseURL2,datos,httpOptions));
  }
  aceptar_alumnos(id:any,token:any):Promise<any>{
    if(id==null){
      id="";
    }
    if(token==null){
      token="";
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': token
      })
    }
    return lastValueFrom(this.httpClient.put(this.baseURL3+id,{},httpOptions));
  }
  crear_profe(datos:any):Promise<any>{
    if(datos==null){
      datos="";
    }
    return lastValueFrom(this.httpClient.post(this.baseURL4,datos));
  }

  gestion_de_errores_datos_profesor(err:any):void{
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
  gestion_de_errores_aceptar_alumno(err:any):void{
    if(err.status){
      if(err.status==401){
        Swal.fire('', 'La inscripción pertenece a otro profesor', 'error');
      }
      else if(err.status==500){
        Swal.fire('', 'No existe ninguna inscripción con el identificador especificado', 'error');
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
  gestion_de_errores_alumnos(err:any):void{
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