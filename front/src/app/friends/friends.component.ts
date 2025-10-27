import { Component } from "@angular/core";
import {getCookie, setCookie} from "typescript-cookie";
import {HttpClient} from "@angular/common/http";


@Component({
  selector: "profile",
  template: `
      <profile-base></profile-base>
      <h3 style="text-align: center"> friends count: {{count}}</h3>

      <div style="text-align: center">
          <div class="card-container" *ngFor="let friend of this.friends">
              <div class="card" style="margin-top: 2%">
                  <div class="form-row">
                      <div class="user">
                          <h2 style="margin-bottom: -0.001%"> {{friend.info.first_name}} {{friend.info.second_name}} </h2>
                          <img [src]="friend.info.photo" width="7%" height="7%">
                      </div>
                      <button class="btn btn-secondary text-light my-2" id="delete_friend_button"
                              (click)="deleteFriend(friend.id)"
                              type="button"> delete friend
                      </button>
                  </div>
              </div>
          </div>
      </div>
  `
})

export class FriendsComponent {

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

  deleteFriend(friendID: Number){

    this.httpService.post('//localhost:3000/delete_friend', {key: this.user.id, friend: friendID}).subscribe(
      (data) => {
        this.user = data
        setCookie('user', JSON.stringify(this.user))
        this.updateFriends()
      },
      (error) => {
        console.log(error)}
    );
  }

}




