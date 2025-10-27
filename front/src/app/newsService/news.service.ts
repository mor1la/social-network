import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {io} from "socket.io-client";


@Injectable({
  providedIn: 'root',
})
export class NewsService {
  public message$: BehaviorSubject<{ userID: number; author: string; text: string; date: Date }[]> = new BehaviorSubject<{
    userID: number;
    author: string
    text: string
    date: Date
  }[]>([]);

  constructor() {
  }

  socket = io('http://localhost:3000');

  public sendMessage(message: any) {
    console.log('sendMessage: ', message)
    this.socket.emit('news', message);
  }

  public getNewMessage = () => {
    this.socket.on('news', (message) => {
      this.message$.next(message);
    });

    return this.message$.asObservable();
  };
}
