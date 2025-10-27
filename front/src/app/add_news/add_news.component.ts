import {Component} from "@angular/core"
import {HttpClient} from "@angular/common/http";
import {NewsService} from "../newsService/news.service";
import {getCookie, setCookie} from "typescript-cookie";

@Component({
    selector: "app-root",
    template: `
        <profile-base></profile-base>
        <h1 style="text-align: center">Add news</h1>

        <div class="center" style="text-align: center">
          <form id="news_add" (submit)="sendNews()">
            <input style="text-align: center"
                   name="new_news" [(ngModel)]="new_news"
            />
          </form>
          <button style="margin-top: 1%" type="submit" form="news_add">Send Message</button>
        </div>
    `,
    host: {'collision-id': 'App3Component'},
})
export class Add_newsComponent {
    user: any;
    new_news = ''

    constructor(private newsService: NewsService, private httpService: HttpClient) {
        let temp = getCookie('user')
        if (typeof temp === "string") {
            this.user = JSON.parse(temp)
        }

    }

    sendNews() {
        if (this.new_news !== '') {
            const data = {
                userID: this.user.id,
                author: this.user.info.first_name + ' ' + this.user.info.second_name,
                text: this.new_news,
                date: new Date().toISOString().split('.')[0]
            };

            this.httpService.post(`http://localhost:3000/add_news`, data)
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

            this.newsService.sendMessage(data);
            this.new_news = '';
        }
        else {
            alert("News are empty!")
        }
    }

}
