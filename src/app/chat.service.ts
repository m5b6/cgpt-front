import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private http: HttpClient) {}

  route = 'https://cgpt-back.onrender.com';
  /*    route = 'http://localhost:3000';
   */
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),

    withCredentials: true,
    observe: 'response' as 'response',
  };

  sendMessage(message: string, threadId: string | null) {
    if (!threadId) {
      return this.http.post(`${this.route}/`, { message });
    } else {
      return this.http.post(`${this.route}/`, { message, threadId });
    }
  }

  sendContactForm(contactForm: any) {
    return this.http.post(`${this.route}/submit-contact`, contactForm);
  }
}

export interface contactForm {
  name: string;
  email: string;
  message: string;
}
