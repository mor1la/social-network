import {Component} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {getCookie, setCookie} from "typescript-cookie";


@Component({
    selector: "profile",
    template: `
        <profile-base></profile-base>

        <div>
            <div style="margin-left: 35%; display: flex; flex-wrap: wrap; justify-content: center; width: 30%" class="card-container" *ngFor="let news of this.news">
                <div class="card">
                    <h3 style="margin-bottom: -2%"> {{news.author.info.first_name}} {{news.author.info.second_name}} </h3>
                    <ul style="list-style-type: none">
                        <li>
                            {{news.text}}
                        </li>
                        <li style="margin-top: 2%">
                            {{news.date}}
                        </li>
                    </ul>
                </div>
            </div>
        </div>


    `
})

export class NewsComponent {

    news: any;
    user: any;

    constructor(private httpService: HttpClient) {
        let temp = getCookie('user')
        if (typeof temp === "string") {
            this.user = JSON.parse(temp)
        }
        this.user.info.photo = "http://localhost:3000".concat(this.user.info.photo.split('..')[1])

        this.httpService.post('//localhost:3000/get_news', {key: this.user.id}).subscribe(
            (data) => {
                this.news = data
            },
            (error) => {
                console.log(error)
            }
        );
    }
}




