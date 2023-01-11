import { ThisReceiver } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  
  constructor(
    private router: Router,
  ){}
  
  canActivate ():  boolean | UrlTree {
    let token = localStorage.getItem('token');
    let tipo_usuario = localStorage.getItem('rolId');
    if(token != null && tipo_usuario == "1"){
      return true;
    } else {
      this.router.navigate(['/TeacherApp/buscador']);
      return false;
    }
  }
  
}
