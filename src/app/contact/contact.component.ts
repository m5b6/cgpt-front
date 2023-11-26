import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { contactForm } from '../chat.service';
import { ChatService } from '../chat.service';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  providers: [MessageService],
})
export class ContactComponent {
  constructor(
    private messageService: MessageService,
    private chatService: ChatService
  ) {}

  loading = false;

  async onSubmit(form: NgForm) {
    this.loading = true;
    console.log('Form Data: ', form.value);

    const contactForm: contactForm = {
      name: form.value.name,
      email: form.value.email,
      message: form.value.message,
    };
    console.log('contactForm: ', contactForm);

    const response = firstValueFrom(
      this.chatService.sendContactForm(contactForm)
    )
      .then((response) => {
        console.log('response: ', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Mensaje enviado',
          detail:
            '¡Gracias! 😊 Le responderemos a la dirección de correo electrónico que proporcionó.',
        });
        form.reset();
      })
      .catch((error) => {
        console.log('error: ', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: '¡Hubo un error al enviar su mensaje! 😢 Inténtelo denuevo.',
        });
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
