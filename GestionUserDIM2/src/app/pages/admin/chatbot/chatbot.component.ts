import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss'],
  imports: [CommonModule, FormsModule, HttpClientModule],
})
export class ChatbotComponent {
  messages: { from: 'user' | 'bot', text: string }[] = [];
  input = '';
  isOpen = false;

  constructor(private http: HttpClient) {}

  toggle() {
  this.isOpen = !this.isOpen;

  if (this.isOpen && this.messages.length === 0) {
    this.messages.push({
      from: 'bot',
      text: 'Bonjour, comment puis-je vous aider ?'
    });
  }
}

  send() {
    const question = this.input.trim();
    if (!question) return;

    this.messages.push({ from: 'user', text: question });
    this.input = '';

    this.http.post<any>('http://localhost:8000/chat', { question }).subscribe({
      next: (res) => {
        this.messages.push({ from: 'bot', text: res.response });
      },
      error: () => {
        this.messages.push({ from: 'bot', text: '❌ Erreur lors de la réponse.' });
      }
    });
  }

  
}
