import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { environment } from 'src/environments/environment';

import Swal from'sweetalert2';

@Component({
  selector: 'app-admin-perfil',
  templateUrl: './admin-perfil.component.html',
  styleUrls: ['./admin-perfil.component.css']
})
export class AdminPerfilComponent implements OnInit {

  user: any;
  formAdmin: FormGroup;
  changePassword: boolean = false;
  errorAvatar: boolean = false;
  errorPassword: boolean = false;
  image: any;

  constructor(
    private usuarioService: UsuarioService
  ) {
    this.formAdmin = new FormGroup({
      email: new FormControl({value: '', disabled: true}),
      username: new FormControl({value: '', disabled: true}),
      name: new FormControl({value: '', disabled: true}),
      avatar: new FormControl(''),
      checkPassword: new FormControl(false),
      password: new FormControl({value: '', disabled: true})
    });
  }

  ngOnInit(): void {
    this.getInfoUser();
  }

  getUserImage(): string {
    return this.user?.imagen ? `${environment.API_URL}/images/avatars/${this.user.imagen}` : 'https://eu.ui-avatars.com/api/?name='+this.user?.nombreCompleto+'&size=250' ;
  }

  async getInfoUser() {
    let response = await this.usuarioService.getInfoUser();
    this.user = response.admin;
    this.formAdmin.get('email')?.setValue(this.user.email);
    this.formAdmin.get('username')?.setValue(this.user.userName);
    this.formAdmin.get('name')?.setValue(this.user.nombreCompleto);
    this.formAdmin.get('avatar')?.setValue(this.user.imagen);
  }

  async onSubmit(formData: any) {
    this.errorAvatar = false;
    this.errorPassword = false;
    if(this.image !== undefined) {
      if(!this.image.name.match(/\.(jpg|jpeg|png)$/)) {
        this.errorAvatar = true;
      }
    }
    if(formData.checkPassword) {
      if(formData.password.length < 6) {
        this.errorPassword = true;
      }
    }
    if(!this.errorAvatar && !this.errorPassword) {
      if(formData.checkPassword) {
        await this.usuarioService.changePasswordUser(formData.password);
      }
      if(this.image !== undefined) {
        let fd = new FormData();
        if(this.image) {
          fd.append('imagen', this.image, this.image.name);
          await this.usuarioService.changeImageUser(fd);
        }
      }
      Swal.fire({
        title: 'Correcto',
        text: "Usuario modificado",
        icon: 'success',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        if (result.isConfirmed) {
          location.reload();
        }
      })
    }
  }

  changeCheck() {
    this.changePassword = !this.changePassword;
    if(this.changePassword) {
      this.formAdmin.get('password')?.enable();
    } else {
      this.formAdmin.get('password')?.disable();
    }
  }

  fileChoosen(event: any) {
    if(event.target.value) {
      this.image = <File>event.target.files[0];
    }
  }

}
