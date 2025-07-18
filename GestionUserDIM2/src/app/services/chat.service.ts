// import { Injectable } from '@angular/core';
// import { Client, IMessage, Stomp } from '@stomp/stompjs';
// import SockJS from 'sockjs-client';
//
// @Injectable({ providedIn: 'root' })
// export class ChatService {
//   private stompClient: Client;
//
//   constructor() {
//
//     const token = localStorage.getItem('token');
//     console.log('Token envoyé dans connectHeaders:', token);
//     this.stompClient = new Client({
//       webSocketFactory: () => new SockJS('http://localhost:8081/ws-chat'),
//       connectHeaders: {
//         Authorization: `Bearer ${token}` // 👈 obligatoire
//       },
//       reconnectDelay: 5000,
//       debug: () => {}
//     });
//
//   }
//
//   connect(onMessage: (msg: any) => void): void {
//     this.stompClient.onConnect = () => {
//       console.log('[✅ CONNECTÉ au WebSocket]');
//       this.stompClient.subscribe('/topic/public', (message: IMessage) => {
//         console.log('[📥 Message reçu du serveur]', message.body);
//         onMessage(JSON.parse(message.body));
//       });
//     };
//
//
//     this.stompClient.onStompError = (frame) => {
//       console.error('STOMP error:', frame.headers['message']);
//     };
//
//     this.stompClient.activate();
//   }
//
//   sendMessage(sender: string, content: string): void {
//     const username = localStorage.getItem('email') || 'inconnu';
//     const message = {
//       sender: username,
//       content,
//       timestamp: new Date().toISOString()
//     };
//
//     this.stompClient.publish({
//       destination: '/app/chat.send',
//       body: JSON.stringify(message)
//     });
//   }
//
//   disconnect(): void {
//     this.stompClient.deactivate();
//   }
//
//
//   getHistory(): Promise<any[]> {
//     return fetch('http://localhost:8081/api/chat/history')
//       .then(res => {
//         if (!res.ok) {
//           throw new Error('Erreur HTTP ' + res.status);
//         }
//         return res.json();
//       })
//       .then(data => {
//         if (!Array.isArray(data)) {
//           console.error('La réponse n’est pas un tableau :', data);
//           return [];
//         }
//         return data;
//       })
//       .catch(err => {
//         console.error('Erreur lors du chargement de l’historique :', err);
//         return [];
//       });
//   }
//
// }
