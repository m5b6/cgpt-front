import { Component } from '@angular/core';
import { ChatService } from '../chat.service';
import { firstValueFrom } from 'rxjs';
import { ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { OnInit } from '@angular/core';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  providers: [MessageService],
})
export class ChatComponent implements OnInit {
  constructor(
    private chatService: ChatService,
    public messageService: MessageService
  ) {}
  messages: Message[] = [
    {
      content:
        '¡Hola! Soy ConstituciónGPT, te daré respuestas a tus preguntas sobre la nueva Propuesta de Constitución Política de la República de Chile. ¿Cómo puedo ayudarte?',
      sender: 'yours',
      /* quote:
        'lorem ipsum dolor sit amet consectetur adipiscing elit sed do lorem ipsum dolor sit amet consectetur adipiscing elit sed do lorem ipsum dolor sit amet consectetur adipiscing elit sed do v lorem ipsum dolor sit amet consectetur adipiscing elit sed do v lorem ipsum dolor sit amet consectetur adipiscing elit sed do lorem ipsum dolor sit amet consectetur adipiscing elit sed do lorem ipsum dolor sit amet consectetur adipiscing elit sed do lorem ipsum dolor sit amet consectetur adipiscing elit sed do, lorem ipsum dolor sit amet consectetur adipiscing elit sed do, lorem ipsum dolor sit amet consectetur adipiscing elit sed do, lorem ipsum dolor sit amet consectetur adipiscing elit sed do lorem ipsum dolor sit amet consectetur adipiscing elit sed do lorem ipsum dolor sit amet consectetur adipiscing elit sed do lorem ipsum dolor sit amet consectetur adipiscing elit sed do lorem ipsum dolor sit amet consectetur adipiscing elit sed do lorem ipsum dolor sit amet consectetur adipiscing elit sed do lorem ipsum dolor sit amet consectetur adipiscing elit sed do v lorem ipsum dolor sit amet consectetur adipiscing elit sed do v lorem ipsum dolor sit amet consectetur adipiscing elit sed do lorem ipsum dolor sit amet consectetur adipiscing elit sed do lorem ipsum dolor sit amet consectetur adipiscing elit sed do lorem ipsum dolor sit amet consectetur adipiscing elit sed do, lorem ipsum dolor sit amet consectetur adipiscing elit sed do, lorem ipsum dolor sit amet consectetur adipiscing elit sed do, lorem ipsum dolor sit amet consectetur adipiscing elit sed do lorem ipsum dolor sit amet consectetur adipiscing elit sed do lorem ipsum dolor sit amet consectetur adipiscing elit sed do lorem ipsum dolor sit amet consectetur adipiscing elit sed do',
    */
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

  loadingFlavorTextArray: string[] = [
    'leyendo la constitución',
    'estudiando la constitución',
    'analizando la constitución',
    'buscando en la constitución',
    'examinando cláusulas constitucionales',
    'navegando la constitución',
    'pensando',
    'revisando la constitución',
  ];

  dots: string = '...';

  loadingFlavorText: string = this.loadingFlavorTextArray[0];
  async sendMessage() {
    this.updateGroupedMessages();
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
        isThinking: true,
      };

      this.loadingFlavorText =
        this.loadingFlavorTextArray[
          Math.floor(Math.random() * this.loadingFlavorTextArray.length)
        ];

      this.messages.push(placeholderMessage);
      this.scrollToBottom();

      this.updateGroupedMessages();

      firstValueFrom(
        this.chatService.sendMessage(
          this.newMessageContent,
          localStorage.getItem('cgptThreadId') || null
        )
      )
        .then(async (response: any) => {
          this.loading = false;
          placeholderMessage.isThinking = false;
          this.isWriting = true;
          const responseData = response;
          const messageContent = responseData.responseText;
          const quote = responseData.citation;
          if (responseData.threadId) {
            localStorage.setItem('cgptThreadId', responseData.threadId);
          }

          placeholderMessage.content = '';
          setTimeout(() => {
            this.scrollToBottom();
          }, 1);
          await this.typeWriter(messageContent, this.messages.length - 1);
          if (quote) {
            this.messages[this.messages.length - 1].quote = quote;
          }
          this.updateGroupedMessages();
        })
        .catch(async (error) => {
          setTimeout(async () => {
            placeholderMessage.isThinking = false;
            const messageContent =
              'Estoy experimentando problemas técnicos, por favor inténtelo de nuevo más tarde.';
            await this.typeWriter(messageContent, this.messages.length - 1);
            this.loading = false;
          }, 1000);
        })
        .finally(() => {
          this.updateGroupedMessages();
          this.scrollToBottom();
          this.saveChatHistory();
        });
      this.newMessageContent = '';
      this.scrollToBottom();
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
    setTimeout(() => {
      try {
        this.chatContainer.nativeElement.scrollTop =
          this.chatContainer.nativeElement.scrollHeight * 1.5;
      } catch (err) {
        console.error('Error while scrolling:', err);
      }
    }, 100);
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

  saveChatHistory() {
    localStorage.setItem('cgptChatHistory', JSON.stringify(this.messages));
  }

  loadChatHistory() {
    const savedMessages = localStorage.getItem('cgptChatHistory');
    if (savedMessages) {
      this.messages = JSON.parse(savedMessages);
      this.updateGroupedMessages();
    }
  }
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  alterDots() {
    setInterval(() => {
      if (this.dots.length < 4) {
        this.dots += '.';
      } else {
        this.dots = '';
      }
    }, 300);
  }

  ngOnInit(): void {
    this.loadChatHistory();
    this.alterDots();
    this.scrollToBottom();
  }
}

export interface Message {
  content: string;
  sender: 'mine' | 'yours';
  isTyping?: boolean;
  isThinking?: boolean;
  quote?: string;
}
