import { Component } from '@angular/core';
import { ChatService } from '../chat.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
  constructor(private chatService: ChatService) {}
  messages: Message[] = [];
  newMessageContent: string = '';
  loading: boolean = false;

  async sendMessage() {
    if (this.newMessageContent.trim()) {
      this.messages.push({
        content: this.newMessageContent,
        sender: 'mine',
      });
      this.loading = true;
      this.messages.push({
        content: '...',
        sender: 'yours',
      });
      firstValueFrom(this.chatService.sendMessage(this.newMessageContent)).then(
        (response) => {
          this.loading = false;
          console.log(response);
        }
      );
      this.newMessageContent = '';
    }
  }

  getGroupedMessages(): Message[][] {
    return this.messages.reduce((acc, message) => {
      if (
        acc.length === 0 ||
        acc[acc.length - 1][0].sender !== message.sender
      ) {
        acc.push([message]);
      } else {
        acc[acc.length - 1].push(message);
      }
      return acc;
    }, [] as Message[][]);
  }
}

export interface Message {
  content: string;
  sender: 'mine' | 'yours';
}
