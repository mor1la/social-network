import {Component} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {getCookie, setCookie} from "typescript-cookie";
import {ActivatedRoute, Router} from "@angular/router";
import {MessageService} from "../messageService/message.service";


@Component({
  selector: "profile",
  template: `
      <profile-base></profile-base>

      <div>
          <div style="display: flex; flex-wrap: wrap; justify-content: center; width: 100%" class="card-container" *ngFor="let message of messages">
              <div class="card">
                  <h3 style="margin-bottom: -3%"> {{message.author}}</h3>
                  <ul style="list-style-type: none">
                      <li>
                          {{message.text}}
                      </li>
                      <li style="margin-top: 4%">
                          {{message.date}}
                      </li>
                  </ul>
              </div>
          </div>
      </div>

      <div>
        <div style="display: flex; flex-wrap: wrap; justify-content: center; width: 100%" class="card-container" *ngFor="let message of messageList">
          <div class="card">
            <h3 style="margin-bottom: -3%"> {{message.author}}</h3>
            <ul style="list-style-type: none">
              <li>
                {{message.text}}
              </li>
              <li style="margin-top: 4%">
                {{message.date}}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="container" style="bottom: 2%; left: 44%; text-align: center; margin-top: 1%">
          <div class="input-message" style="">
              <h4>type new message:</h4>
              <form id="new_message" (submit)="sendMessage()">
                  <input
                          name="new_message" [(ngModel)]="new_message"
                  />
              </form>
          </div>
      </div>

  `,
  host: {'collision-id': 'App3Component'},
})

export class MessageUserComponent {

  user: any
  friend: any
  friendID: any
  messages: any
  new_message: any
  messageList: any = []

  constructor(private httpService: HttpClient, private route: ActivatedRoute, private router: Router, private messageService: MessageService) {
    let temp = getCookie('user')
    if (typeof temp === "string") {
      this.user = JSON.parse(temp)
    }
    this.user.info.photo = "http://localhost:3000".concat(this.user.info.photo.split('..')[1])

    this.route.params.subscribe(params => {
      this.friendID = +params['id']
      if (!this.user.friends.includes(this.friendID)) {
        this.friendID = null
        this.router.navigate(['/messages'])
      }
    })

    this.httpService.post('//localhost:3000/sign_in', {key: this.friendID}).subscribe(
      (data) => {
        this.friend = data;

        this.messages = []

        let myMessages = this.user.messages.find(
          (myContent: { to: number; }) => myContent.to === Number(this.friendID))

        if (myMessages) {
          this.messages.push(...myMessages.content.map((elem: { text: any; date: any; }) => {
            return {
              text: elem.text,
              date: elem.date,
              author: 'You'
            }
          }))
        }

        let friendMessages = this.friend.messages.find(
          (myContent: { to: number; }) => myContent.to === Number(this.user.id))

        if (friendMessages) {
          this.messages.push(...friendMessages.content.map((elem: { text: any; date: any; }) => {
            return {
              text: elem.text,
              date: elem.date,
              author: this.friend.info.first_name + ' ' + this.friend.info.second_name
            }
          }))
        }

        this.sortMessages()

      },
      (error) => {
        alert("No such user!")
        console.log(error)
      }
    );

    this.messageService.getNewMessage()
      .subscribe((message: any) => {
        this.messageList.push(message);

      });

  }

  sortMessages() {
    this.messages.sort(this.compare)
  }

  compare(a: { date: string; }, b: { date: string; }) {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    return dateA.getTime() - dateB.getTime();
  }

  sendMessage() {
    if (this.new_message !== '') {
      const data = {
        userID: this.user.id,
        friendID: this.friendID,
        author: 'You',
        text: this.new_message,
        date: new Date().toISOString().split('.')[0]
      };

      this.httpService.post(`http://localhost:3000/add_message`, data)
        .subscribe({
          next: (data) => {
            this.user = data
            setCookie('user', JSON.stringify(this.user))
            this.user.info.photo = "http://localhost:3000".concat(this.user.info.photo.split('..')[1])
          },
          error: (err) => {
            console.log("Error:", err);
          }
        });

      this.messageService.sendMessage(data);
      this.new_message = '';
    }
    else {
      alert("News are empty!")
    }
  }
}




