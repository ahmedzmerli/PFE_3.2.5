import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatMessage } from 'src/app/models/chatmessage.model';
import { WebSocketService } from 'src/app/services/websocket.service';
import { TokenService } from 'src/app/services/token.service';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  messages: ChatMessage[] = [];
  message: string = '';
  username: string = '';
  private sub!: Subscription;

  constructor(
    private wsService: WebSocketService,
    private tokenService: TokenService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.username = this.tokenService.getEmail() || 'anonyme';
    this.wsService.connect();

    this.http.get<ChatMessage[]>('http://localhost:8081/api/v1/chat').subscribe(
      data => this.messages = data,
      err => console.error(err)
    );

    this.sub = this.wsService.message$.subscribe(msg => {
      if (msg) {
        this.messages.push(msg);
      }
    });
  }

  send(): void {
    if (this.message.trim()) {
      const chatMsg: ChatMessage = {
        sender: this.username,
        content: this.message.trim(),
      };
      this.wsService.sendMessage(chatMsg);
      this.message = '';
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.wsService.disconnect();
  }
}
