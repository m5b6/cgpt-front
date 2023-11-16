import { Component } from '@angular/core';
import { ChatService } from '../chat.service';
import { firstValueFrom } from 'rxjs';
import { ViewChild } from '@angular/core';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
  constructor(private chatService: ChatService) {}
  messages: Message[] = [
    {
      content: 'Hello, I am a chatbot. How can I help you?',
      sender: 'yours',
    },
    {
      content: 'Hello, I am a chatbot. How can I help you?',
      sender: 'yours',
    },
    {
      content: 'Hello, I am a chatbot. How can I help you?',
      sender: 'yours',
    },
    {
      content: 'Hello, I am a chatbot. How can I help you?',
      sender: 'yours',
    },
    {
      content: 'Hello, I am a chatbot. How can I help you?',
      sender: 'yours',
    },
    {
      content: 'Hello, I am a chatbot. How can I help you?',
      sender: 'yours',
    },
    {
      content: 'Hello, I am a chatbot. How can I help you?',
      sender: 'mine',
    },
    {
      content: 'Hello, I am a chatbot. How can I help you?',
      sender: 'yours',
    },
  ];
  newMessageContent: string = '';
  loading: boolean = false;
  muted: boolean = false;

  @ViewChild('chatContainer') chatContainer: any;

  async sendMessage() {
    if (this.newMessageContent.trim() && !this.loading) {
      this.messages.push({
        content: this.newMessageContent,
        sender: 'mine',
      });
      this.loading = true;
      this.playSound('sent');

      const placeholderMessage: Message = {
        content: '...',
        sender: 'yours',
      };
      this.messages.push(placeholderMessage);

      firstValueFrom(this.chatService.sendMessage(this.newMessageContent)).then(
        (response: any) => {
          this.loading = false;
          const messageContent = response.messages[0].content[0].text.value;
          placeholderMessage.content = messageContent;
          setTimeout(() => {
            this.scrollToBottom();
          }, 100);
          this.playSound('recieved');
        }
      );
      this.newMessageContent = '';
      setTimeout(() => {
        this.scrollToBottom();
      }, 100);
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

  private scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop =
        this.chatContainer.nativeElement.scrollHeight * 100;
    } catch (err) {
      console.error('Error while scrolling:', err);
    }
  }

  playSound(file: 'sent' | 'recieved') {
    if (!this.muted) {
      const audio = new Audio();
      audio.src = `../../assets/${file}.mp3`;
      audio.load();
      audio.play();
    }
  }
}

export interface Message {
  content: string;
  sender: 'mine' | 'yours';
}
