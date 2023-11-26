import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private http: HttpClient) {}

  route = 'http://localhost:3000';

  sendMessage(message: string) {
    return this.http.post(`${this.route}/`, { message });
  }

  sendContactForm(contactForm: any) {
    return this.http.post(`${this.route}/contact`, contactForm);
  }
}

export interface contactForm {
  name: string;
  email: string;
  message: string;
}
