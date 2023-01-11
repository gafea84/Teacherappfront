import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  saveData(token: string, roleId: string, email: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('rolId', roleId);
    localStorage.setItem('email', email);
  }

  getData() {
    let token = localStorage.getItem('token');
    let rolId = localStorage.getItem('rolId');
    let email = localStorage.getItem('email');
    return { token, rolId, email }
  }

  deleteData() {
    localStorage.removeItem('token');
    localStorage.removeItem('rolId');
    localStorage.removeItem('email');
  }

}
