import {Component} from "@angular/core";
import {getCookie, setCookie} from "typescript-cookie";
import {HttpClient} from "@angular/common/http";
import {NewsService} from "../newsService/news.service";

@Component({
    selector: "profile",
    templateUrl: "./profile.component.html",
    styleUrls: ["./profile.component.css"]
})
export class ProfileComponent {
    image: any
    user: any
    newsList: any[] = []

    constructor(private newsService: NewsService, private httpService: HttpClient) {
        let temp = getCookie('user')
        if (typeof temp === "string") {
            this.user = JSON.parse(temp)
        }
        this.user.info.photo = "http://localhost:3000".concat(this.user.info.photo.split('..')[1])

        this.newsService.getNewMessage()
            .subscribe((message: any) => {
                this.newsList.unshift(message);
            });
    }

    uploadPhoto(event: any) {
        this.image = event.target.files[0]
    }

    setPhoto() {
        const formData = new FormData()
        formData.append('key', this.user.id)
        formData.append('image', this.image)

        this.httpService.post('//localhost:3000/set_photo', formData).subscribe(
            (data) => {
                this.user = data
                setCookie('user', JSON.stringify(this.user))
                this.user.info.photo = "http://localhost:3000".concat(this.user.info.photo.split('..')[1])
            },
            (error) => {
                console.log(error)
            }
        );
    }

    deletePhoto() {
        this.httpService.post('//localhost:3000/delete_photo', {key: this.user.id}).subscribe(
            (data) => {
                this.user = data
                setCookie('user', JSON.stringify(this.user))
                this.user.info.photo = "http://localhost:3000".concat(this.user.info.photo.split('..')[1])
            },
            (error) => {
                console.log(error)
            }
        );
    }
}