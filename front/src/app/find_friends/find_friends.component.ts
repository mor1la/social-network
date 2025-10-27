import { Component } from "@angular/core";
import {getCookie, setCookie} from "typescript-cookie";
import {HttpClient} from "@angular/common/http";


@Component({
  selector: "profile",
  template: `
    <profile-base></profile-base>

    <div style="text-align: center">
        <div class="card-container" *ngFor="let new_user of this.users">
          <div class="card" style="margin-top: 2%">
            <div class="form-row">
              <div class="user" >
                <h2 style="margin-bottom: -0.001%"> {{new_user.info.first_name}} {{new_user.info.second_name}} </h2>
                <img [src]="new_user.info.photo" width="7%" height="7%">
              </div>
              <button class="btn btn-secondary text-light my-2" id="delete_friend_button" (click)="addFriend(new_user.id)"
                      type="button"> add friend </button>
            </div>
          </div>
        </div>
    </div>
  `
})

export class Find_friendsComponent {

  user: any
  users: any
  constructor(private httpService: HttpClient) {
    let temp = getCookie('user')
    if (typeof temp === "string") {
      this.user = JSON.parse(temp)
    }

    this.updateUsers()

  }

  updateUsers(){
    this.httpService.post('//localhost:3000/not_friends', {key: this.user.id}).subscribe(
      (data) => {
        this.users = data

        for(let new_user of this.users){
          new_user.info.photo = "http://localhost:3000".concat(new_user.info.photo.split('..')[1])
        }

      },
      (error) => {
        console.log(error)}
    );
  }

  addFriend(newID: Number){

    this.httpService.post('//localhost:3000/add_friend', {key: this.user.id, new_user: newID}).subscribe(
      (data) => {
        this.user = data
        setCookie('user', JSON.stringify(this.user))
        this.updateUsers()
      },
      (error) => {
        console.log(error)}
    );
  }

}




