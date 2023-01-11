import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.component.html',
  styleUrls: ['./iniciar-sesion.component.css']
})

export class IniciarSesionComponent implements OnInit {

  userForm_inicio: FormGroup;

  constructor(
    private loginService:LoginService
  ) {
    this.userForm_inicio = new FormGroup({
      email:new FormControl('',[Validators.required,Validators.pattern(/^[\w-.]+@([\w-]+\.)+[\w-]{2,20}$/)]),
      password:new FormControl('',[Validators.required,Validators.minLength(6)]),
    });
  }

  ngOnInit(): void {
  }
  //Funcion para logearse al iniciar sesion
  async logearse(): Promise<void> {
    let User = this.userForm_inicio.value;
    await this.loginService.login_user(User)
      .then(response => {
        this.loginService.gestion_de_login(response);
      })
      .catch(err=>{
        this.loginService.gestion_de_errores_login(err);
      });
  }

}
