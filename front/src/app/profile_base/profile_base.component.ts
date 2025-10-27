import { Component } from "@angular/core";
import {getCookie, setCookie} from "typescript-cookie";
import {NewsService} from "../newsService/news.service";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: "profile-base",
  templateUrl: "./profile_base.component.html",
  styleUrls: ["./profile_base.component.css"]
})
export class Profile_baseComponent {

  userID: Number = 0;
  user: any;

  constructor() {
    let temp = getCookie('user')
    if (typeof temp === "string") {
      this.user = JSON.parse(temp)
    }
    this.user.info.photo = "http://localhost:3000".concat(this.user.info.photo.split('..')[1])
  }

  clearCookie(){
    setCookie('user', null)
  }
}