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
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus velit elit, malesuada in bibendum nec, tristique nec leo. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Interdum et malesuada fames ac ante ipsum primis in faucibus. Aliquam malesuada, purus ut viverra consectetur, purus urna rutrum nisl, in lacinia arcu mauris eget nibh. Quisque blandit ante mi. Nunc blandit iaculis suscipit. Phasellus feugiat consequat sagittis.',
      sender: 'yours',
    },
    {
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      sender: 'yours',
      quote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
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
  dialogVisible: boolean = false;

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
          const quote =
            response.messages[0].content[0].text.annotations[0].file_citation
              .quote;
          if (quote) {
            this.messages[this.messages.length - 1].quote = quote;
          }

          placeholderMessage.content = '';
          setTimeout(() => {
            this.scrollToBottom();
          }, 1);
          this.playSound('recieved');
          this.typeWriter(messageContent, this.messages.length - 1);
        }
      );
      this.newMessageContent = '';
      setTimeout(() => {
        this.scrollToBottom();
      }, 1);
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
        this.chatContainer.nativeElement.scrollHeight * 1.5;
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

  typeWriter(text: string, index: number, i = 0) {
    const speed = 10; // Typing speed in milliseconds
    setTimeout(() => {
      this.scrollToBottom();
    }, 1);
    if (i <= text.length) {
      this.messages[index].content = text.substring(0, i);
      this.messages[index].isTyping = true; // Add 'isTyping' flag to the message

      setTimeout(() => {
        if (i === text.length) {
          this.messages[index].isTyping = false; // Remove the caret when done
        }
        this.typeWriter(text, index, i + 1);
      }, speed);
    }
  }

  viewCitation() {
    this.dialogVisible = true;
  }
}

export interface Message {
  content: string;
  sender: 'mine' | 'yours';
  isTyping?: boolean;
  quote?: string;
}
