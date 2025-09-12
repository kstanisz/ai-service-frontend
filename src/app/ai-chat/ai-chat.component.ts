import {AfterViewChecked, Component, ElementRef, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DecimalPipe, NgClass} from '@angular/common';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AiResponseDto, AiResponseSourceDto} from './ai-chat-model';

interface Message {
  type: 'user' | 'bot';
  content: string;
}

@Component({
  selector: 'app-ai-chat',
  templateUrl: './ai-chat.component.html',
  imports: [
    FormsModule,
    NgClass,
    HttpClientModule,
    DecimalPipe
  ],
  styleUrls: ['./ai-chat.component.css']
})
export class AiChatComponent implements AfterViewChecked {
  conversationId: string | undefined = undefined;
  messages: Message[] = [];
  input = '';
  employeeId: string = 'EMP_12345';
  sources: AiResponseSourceDto[] = [];

  @ViewChild('chatEnd') chatEndRef!: ElementRef;

  constructor(private httpClient: HttpClient) {
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  async sendMessage() {
    const prompt = this.input.trim();
    if (!prompt) {
      return;
    }

    this.messages.push({ type: 'user', content: prompt });
    this.input = '';

    const chatBotMessage: Message = { type: 'bot', content: '...' };
    this.messages.push(chatBotMessage);

    this.sendMessageToAiService(prompt).subscribe({
      next: res => {
        this.conversationId = res.conversationId;
        this.sources = res.sources;
        chatBotMessage.content = res.content;
      },
      error: err => {
        if (err.status === 422) {
          chatBotMessage.content = 'Niewłaściwe pytanie!';
        } else {
          chatBotMessage.content = 'Błąd komunikacji z chatbotem';
        }
        console.error(err);
      }
    });
  }

  private sendMessageToAiService(message: string): Observable<AiResponseDto> {
    const form = {
      prompt: message,
      conversationId: this.conversationId,
      userId: this.employeeId
    };
    return this.httpClient.post<AiResponseDto>('/chat/_generate_response', form);
  }

  private scrollToBottom() {
    this.chatEndRef?.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
}
