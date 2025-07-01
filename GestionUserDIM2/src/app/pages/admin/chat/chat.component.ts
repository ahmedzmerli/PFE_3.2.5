// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { ChatService} from "../../../services/chat.service";
//
// @Component({
//   selector: 'app-chat',
//   templateUrl: './chat.component.html',
//   styleUrls: ['./chat.component.scss']
// })
// export class ChatComponent implements OnInit, OnDestroy {
//   messages: any[] = [];
//   newMessage = '';
//   username = localStorage.getItem('email') || 'Moi';  // à condition que tu stockes `email` après login
//
//
//   constructor(private chatService: ChatService) {}
//
//   ngOnInit(): void {
//
//     this.chatService.getHistory().then(history => {
//       console.log('Historique chargé :', history);
//       this.messages = history; // tableau d'objets { sender, content, timestamp }
//       this.chatService.connect((msg) => this.messages.push(msg));
//     });
//   }
//
//   send(): void {
//     if (this.newMessage.trim()) {
//       console.log('[📤 Message envoyé]', this.newMessage.trim());
//       this.chatService.sendMessage(this.username, this.newMessage.trim());
//       this.newMessage = '';
//     }
//   }
//
//   ngOnDestroy(): void {
//     this.chatService.disconnect();
//   }
// }
