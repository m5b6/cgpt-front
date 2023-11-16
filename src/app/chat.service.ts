import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private http: HttpClient) {}

  route = 'http://localhost:3000';

  sendMessage(message: string) {
    return this.http.post(`${this.route}/test`, { message });
  }
}
