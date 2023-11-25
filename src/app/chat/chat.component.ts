import { Component } from '@angular/core';
import { ChatService } from '../chat.service';
import { firstValueFrom } from 'rxjs';
import { ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
  constructor(private chatService: ChatService, public dialog: MatDialog) {}
  messages: Message[] = [
    {
      content:
        '¡Hola! Soy ConstituciónGPT, te daré respuestas a tus preguntas sobre la nueva Propuesta de Constitución Política de la República de Chile. ¿Cuál es tu pregunta?',
      sender: 'yours',
      quote:
        'lorem ipsum dolor sit amet consectetur adipiscing elit sed do lorem ipsum dolor sit amet consectetur adipiscing elit sed do lorem ipsum dolor sit amet consectetur adipiscing elit sed do v lorem ipsum dolor sit amet consectetur adipiscing elit sed do v lorem ipsum dolor sit amet consectetur adipiscing elit sed do lorem ipsum dolor sit amet consectetur adipiscing elit sed do lorem ipsum dolor sit amet consectetur adipiscing elit sed do lorem ipsum dolor sit amet consectetur adipiscing elit sed do, lorem ipsum dolor sit amet consectetur adipiscing elit sed do, lorem ipsum dolor sit amet consectetur adipiscing elit sed do, lorem ipsum dolor sit amet consectetur adipiscing elit sed do lorem ipsum dolor sit amet consectetur adipiscing elit sed do lorem ipsum dolor sit amet consectetur adipiscing elit sed do lorem ipsum dolor sit amet consectetur adipiscing elit sed do lorem ipsum dolor sit amet consectetur adipiscing elit sed do lorem ipsum dolor sit amet consectetur adipiscing elit sed do lorem ipsum dolor sit amet consectetur adipiscing elit sed do v lorem ipsum dolor sit amet consectetur adipiscing elit sed do v lorem ipsum dolor sit amet consectetur adipiscing elit sed do lorem ipsum dolor sit amet consectetur adipiscing elit sed do lorem ipsum dolor sit amet consectetur adipiscing elit sed do lorem ipsum dolor sit amet consectetur adipiscing elit sed do, lorem ipsum dolor sit amet consectetur adipiscing elit sed do, lorem ipsum dolor sit amet consectetur adipiscing elit sed do, lorem ipsum dolor sit amet consectetur adipiscing elit sed do lorem ipsum dolor sit amet consectetur adipiscing elit sed do lorem ipsum dolor sit amet consectetur adipiscing elit sed do lorem ipsum dolor sit amet consectetur adipiscing elit sed do',
    },
  ];
  newMessageContent: string = '';
  loading: boolean = false;
  muted: boolean = false;
  dialogVisible: boolean = false;
  selectedCitation: string = '';
  isWriting: boolean = false;
  groupedMessages: Message[][] = [];

  @ViewChild('chatContainer') chatContainer: any;
  @ViewChild('citationDialog') citationDialog: any;

  async sendMessage() {
    this.updateGroupedMessages();

    console.log(!this.isWriting);
    if (this.newMessageContent.trim() && !this.loading && !this.isWriting) {
      this.messages.push({
        content: this.newMessageContent,
        sender: 'mine',
      });
      this.updateGroupedMessages();
      this.loading = true;
      this.playSound('sent');

      const placeholderMessage: Message = {
        content: '...',
        sender: 'yours',
      };

      this.messages.push(placeholderMessage);
      this.scrollToBottom();

      this.updateGroupedMessages();

      firstValueFrom(this.chatService.sendMessage(this.newMessageContent)).then(
        async (response: any) => {
          this.loading = false;
          setTimeout(() => {
            placeholderMessage.isThinking = true;
          }, 1000);
          this.isWriting = true;
          const messageContent =
            response./* messages */ data.content[0].text.value;
          const quote =
            response./* messages */ data.content[0].text?.annotations[0]
              ?.file_citation?.quote;

          placeholderMessage.content = '';
          setTimeout(() => {
            this.scrollToBottom();
          }, 1);
          await this.typeWriter(messageContent, this.messages.length - 1);
          if (quote) {
            this.messages[this.messages.length - 1].quote = quote;
          }
          this.updateGroupedMessages();
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

  private updateGroupedMessages(): void {
    this.groupedMessages = this.getGroupedMessages();
  }

  private scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop =
        this.chatContainer.nativeElement.scrollHeight * 1.5;
    } catch (err) {
      console.error('Error while scrolling:', err);
    }
  }

  private playSound(file: 'sent' | 'recieved') {
    if (!this.muted) {
      const audio = new Audio();
      audio.src = `../../assets/${file}.mp3`;
      audio.load();
      audio.play();
    }
  }

  async typeWriter(text: string, index: number, i = 0): Promise<void> {
    const speed = 10;
    text = text.replace(/【.*?】/g, '');

    while (i <= text.length) {
      this.messages[index].content = text.substring(0, i);
      this.messages[index].isTyping = true;
      await this.delay(speed);
      i++;
      this.scrollToBottom();
    }

    this.messages[index].isTyping = false;
    this.isWriting = false;
    this.playSound('recieved');
  }

  viewCitation(quote: string) {
    this.citationDialog.citation = quote;
    console.log('intentando abrir.');
    this.citationDialog.open();
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export interface Message {
  content: string;
  sender: 'mine' | 'yours';
  isTyping?: boolean;
  isThinking?: boolean;
  quote?: string;
}
