import { ReturnStatement } from '@angular/compiler';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cabecera',
  templateUrl: './cabecera.component.html',
  styleUrls: ['./cabecera.component.css']
})
export class CabeceraComponent implements OnInit {

  @ViewChild('navbarCollapse') navbarCollapse!: ElementRef;
  @ViewChild('buttonCollapse') buttonCollapse!: ElementRef;

  token: string | null = null;
  rolId: string | null = null;
  email: string | null = null;
  menu: any;
  menuOptions = [
    { type: 'admin', options: [
      { type: 'link', name: 'Perfil', link: '/TeacherApp/admin/perfil'},
      { type: 'link', name: 'Gestionar profesores', link: '/TeacherApp/admin/profesores'},
      { type: 'link', name: 'Gestionar alumnos', link: '/TeacherApp/admin/alumnos'}
    ]},
    { type: 'alumno', options: [
      { type: 'link', name: 'Perfil', link: 'TeacherApp/alumno/perfil'},
      { type: 'link', name: 'Opinar', link: 'TeacherApp/alumno/opinar'},
      { type: 'link', name: 'Mensajes', link: 'TeacherApp/chat'}
    ]  },
    { type: 'profesor', options: [
      { type: 'link', name: 'Perfil', link: 'TeacherApp/profesor/perfil'},
      { type: 'link', name: 'Alumnos', link: 'TeacherApp/profesor/alumnos'},
      { type: 'link', name: 'Mensajes', link: 'TeacherApp/chat'}
    ] }
  ]

  constructor(
    private localStorageService: LocalStorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getLocalStorage();
    this.loadMenu();
  }

  ngAfterViewInit(): void {
    document.querySelectorAll(".close-collapse").forEach(elem => elem.addEventListener('click', () => {
      let classes = this.navbarCollapse.nativeElement.classList;
      let display = window.getComputedStyle(this.buttonCollapse.nativeElement, null).getPropertyValue('display');
      if (classes.contains('show') && display !== 'none') {
        this.buttonCollapse.nativeElement.click();
      }
    }));
  }

  cerrarSesion(): void {
    this.localStorageService.deleteData();
    this.token = null;
    this.rolId = null;
    this.email = null;
    window.location.reload();
    window.location.href = '/TeacherApp/buscador'
  }

  getLocalStorage(): void {
    let localStorage = this.localStorageService.getData();
    if (localStorage.token) {
      this.token = localStorage.token;
      this.rolId = localStorage.rolId;
      this.email = localStorage.email;
    }
  }

  loadMenu(): void {
    if (this.token && this.rolId) {
      this.menu = this.menuOptions[Number(this.rolId) - 1].options;
    }
  }

}
