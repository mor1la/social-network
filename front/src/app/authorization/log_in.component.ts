import { Component } from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {setCookie} from "typescript-cookie";

@Component({
  selector: "log_in",
  template: `
    <div class="auth-container">
      <h2 class="auth-title"> Authorization </h2>

      <div class="form-row">
        <div class="auth-form">
          <form id="sign_in" (submit)="submit()">
            <label class="auth-label" for="key_input"> Key: </label>
            <input class="auth-input" id="key_input" name="key" type="text" [(ngModel)]="key" autocomplete="off" required>
          </form>
        </div>
      </div>

      <div class="form-row">
        <div class="auth-buttons">
          <button class="auth-button" type="submit" form="sign_in">Log In</button>
          <button class="auth-button" (click)="goToReg()" type="button">Register</button>
        </div>
      </div>
    </div>`,
  styleUrls: ["./authorization.component.css"]
})
export class Log_inComponent {
  key: Number | undefined;
  user: any;

  constructor(private httpService: HttpClient, private router: Router) {}

  submit() {
    this.httpService.post('//localhost:3000/sign_in', {key: this.key}).subscribe(
      (data) => {
        this.user = data;
        setCookie('user', JSON.stringify(this.user))
        this.router.navigate(['/profile'])
      },
      (error) => {
        alert("No such user!")
        console.log(error)}
    );
  }

  goToReg() {
    this.router.navigate(['/reg']);
  }
}