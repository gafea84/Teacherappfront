import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import Swal from'sweetalert2';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.component.html',
  styleUrls: ['./recuperar.component.css']
})
export class RecuperarComponent implements OnInit {

  userForm_recuperar: FormGroup;

  constructor(
    private loginService:LoginService,
  ) {
    this.userForm_recuperar = new FormGroup({
      email:new FormControl('',[Validators.required,Validators.pattern(/^[\w-.]+@([\w-]+\.)+[\w-]{2,20}$/)]),
    });
  }

  ngOnInit(): void {
  }
  //Funcion para recuperar la contraseña
  async recuperar(): Promise<void> {
    let User = this.userForm_recuperar.value;
    await this.loginService.recuperar_contra(User)
      .then(response => {
        Swal.fire('Correcto', 'Usuario aceptado', 'success');
      })
      .catch(err=>{
        this.loginService.gestion_de_errores_recuperar(err);
      });
  }

}
