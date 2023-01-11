import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AlumnoService } from 'src/app/services/alumno.service';
import { ChatService } from 'src/app/services/chat.service';
import { InscripcionesService } from 'src/app/services/inscripciones.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ProfesorService } from 'src/app/services/profesor.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  token: string | null = null;
  rolId: string | null = null;
  email: string | null = null;
  contactList: any[] = [];
  contactSelected: any;
  conversations: any;
  conversation: any;
  messages: any[] = [];
  user: any;
  messageToSend: string = '';

  constructor(
    private localStorageService: LocalStorageService,
    private inscripcionesService: InscripcionesService,
    private chatService: ChatService,
    private usuarioService: UsuarioService,
    private alumnoService: AlumnoService,
    private profesoresService: ProfesorService
  ) { }

  ngOnInit(): void {
    this.getLocalStorage();
    this.getInfoUser();
    this.getMessages();
  }

  getLocalStorage(): void {
    let localStorage = this.localStorageService.getData();
    if (localStorage.token) {
      this.token = localStorage.token;
      this.rolId = localStorage.rolId;
      this.email = localStorage.email;
    }
  }

  async getMessages() {
    let response = await this.chatService.getMessages();
    this.conversations = response.conversaciones;
    let unreadConverastions = this.conversations.filter((conversation: any) => conversation.mensajesNoLeidos > 0);
    console.log(unreadConverastions);
    if(this.rolId === "2") {
      let inscripciones = await this.inscripcionesService.getInscripcionesAlumno();
      this.contactList = inscripciones.rows.map((contact: any) => {
        let isUnread = unreadConverastions.find((conversation: any) => conversation.interlocutor.email === contact.email);
        let unreadMessages = isUnread ? isUnread.mensajesNoLeidos : 0;
        return { nombreCompleto: contact.nombreCompleto, id: contact.profesoresId, rolId: contact.rolId, imagen: contact.imagen, email: contact.email, unreadMessages }
      });
    }
    if(this.rolId === "3") {
      let inscripciones = await this.inscripcionesService.getInscripcionesProfesor();
      this.contactList = inscripciones.rows.map((contact: any) => {
        let isUnread = unreadConverastions.find((conversation: any) => conversation.interlocutor.email === contact.email);
        let unreadMessages = isUnread ? isUnread.mensajesNoLeidos : 0;
        return { nombreCompleto: contact.nombreCompleto, id: contact.alumnosId, rolId: contact.rolId, imagen: contact.imagen, email: contact.email, unreadMessages }
      });
    }
  }

  selectConversation(contact: any) {
    this.contactSelected = contact;
    this.conversation = this.conversations.find((conversation: any) => conversation.interlocutor.id === contact.id)
    if(this.conversation) {
      this.messages = this.conversation.mensajes;
    } else {
      this.messages = [];
    }
    if(this.conversation?.mensajesNoLeidos > 0) {
      let unreadMessages = this.conversation.mensajes.filter((message: any) => message.autor === this.contactSelected.id && message.leido === 0);
      for(let message of unreadMessages) {
        this.chatService.setReadMessage(message.id);
      }
      this.getMessages();
    }
    this.scrollToBottom();
  }

  getUserImage(contact: any): string {
    return contact.imagen ? `${environment.API_URL}/images/avatars/${contact.imagen}` : 'https://eu.ui-avatars.com/api/?name='+contact.nombreCompleto+'&size=250';
  }

  getImageMessage(message: any): string {
    if(message.autor === this.conversation.interlocutor.id) {
      return this.conversation.interlocutor.imagen ? `${environment.API_URL}/images/avatars/${this.conversation.interlocutor.imagen}` : 'https://eu.ui-avatars.com/api/?name='+this.conversation.interlocutor.nombreCompleto+'&size=250';
    } else {
      return this.user.imagen ? `${environment.API_URL}/images/avatars/${this.user.imagen}` : 'https://eu.ui-avatars.com/api/?name='+this.user.nombreCompleto+'&size=250';
    }
  }

  getNameMessage(message: any): string {
    return message.autor === this.conversation.interlocutor.id ? this.conversation.interlocutor.nombreCompleto : 'Tú';
  }

  getClassMessage(message: any): string {
    return message.autor === this.conversation.interlocutor.id ? 'flex-row' : 'flex-row-reverse';
  }

  formatHour(timestamp: string) {
    let date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes()}`
  }

  async getInfoUser() {
    let response = await this.usuarioService.getInfoUser();
    this.user = response.profesor ? response.profesor : response.alumno;
  }

  async sendMessage() {
    if(this.messageToSend === '') {
      return;
    }
    let body: any = {
      searchConditions: [
        {
          column: "email",
          operator: "=",
          value: this.contactSelected.email
        }
      ]
    }
    let usuarioId;
    if(this.rolId === "2") {
      body.latitud = 51.0754321;
      body.longitud = 12.4878015;
      body.maximaDistancia = 100000000000;
      let response = await this.profesoresService.getAll(body, true);
      usuarioId = response.rows[0].usuarioId;
    }
    if(this.rolId === "3") {
      let response = await this.alumnoService.getAll(body, true);
      usuarioId = response.rows[0].usuarioId;
    }
    let message = {
      idUsuarioDestino: usuarioId,
      texto: this.messageToSend
    }
    await this.chatService.sendMessage(message);
    let response = await this.chatService.getMessages();
    this.conversations = response.conversaciones;
    this.selectConversation(this.contactSelected);
    this.messageToSend = '';
    this.scrollToBottom();
  }

  scrollToBottom() {
    setTimeout(() => {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    }, 100);

  }

}
