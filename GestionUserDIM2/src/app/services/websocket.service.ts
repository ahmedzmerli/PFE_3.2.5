import { Injectable } from '@angular/core';
import { Client, Message, over } from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Subject } from 'rxjs';
import { ChatMessage } from '../models/chatmessage.model';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient!: Client;
  private messageSubject = new Subject<ChatMessage>();
  public message$ = this.messageSubject.asObservable();

  connect(): void {
    const socket = new SockJS('http://localhost:8081/ws');
    this.stompClient = over(socket);

    this.stompClient.connect({}, () => {
      this.stompClient.subscribe('/topic/public', (message: Message) => {
        const msg: ChatMessage = JSON.parse(message.body);
        this.messageSubject.next(msg);
      });
    });
  }

  sendMessage(message: ChatMessage): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.send('/app/chat.send', {}, JSON.stringify(message));
    }
  }

  disconnect(): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.disconnect(() => {});
    }
  }
}
