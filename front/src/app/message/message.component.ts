import { Component } from "@angular/core";
import {getCookie, setCookie} from "typescript-cookie";
import {HttpClient} from "@angular/common/http";


@Component({
    selector: "profile",
    template: `
        <profile-base></profile-base>

        <div style="text-align: center">
            <div class="card-container" *ngFor="let friend of this.friends">
                <div class="card" style="margin-top: 2%">
                    <div class="form-row">
                        <div class="user">
                            <a style="font-size: 20px; font-weight: bold" href="/message/{{friend.id}}"> {{friend.info.first_name}} {{friend.info.second_name}} </a>
                        </div>
                        <img [src]="friend.info.photo" width="7%" height="7%">
                    </div>
                </div>
            </div>
        </div>
    `
})

export class MessageComponent {

    user: any
    friends: any
    count: Number = 0
    constructor(private httpService: HttpClient) {
        let temp = getCookie('user')
        if (typeof temp === "string") {
            this.user = JSON.parse(temp)
        }

        this.updateFriends()

    }

    updateFriends(){
        this.httpService.post('//localhost:3000/friends', {key: this.user.id}).subscribe(
            (data) => {
                this.friends = data

                this.count = this.friends.length

                for(let friend of this.friends){
                    friend.info.photo = "http://localhost:3000".concat(friend.info.photo.split('..')[1])
                }

            },
            (error) => {
                console.log(error)}
        );
    }

}




