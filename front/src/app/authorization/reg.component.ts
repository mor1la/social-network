import { Component } from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {setCookie} from "typescript-cookie";

@Component({
  selector: "reg",
  template: `
    <div class="auth-container">
      <h2 class="auth-title"> Registration </h2>

      <div class="form-row">
        <div class="auth-form">
          <form id="reg" (submit)="submit()">
            <label class="auth-label" for="email"> Email: </label>
            <input class="auth-input" id="email" type="email" name="email" [(ngModel)]="email" autocomplete="off">
            
            <label class="auth-label" for="first_name"> First name: </label>
            <input class="auth-input" id="first_name" type="text" name="first_name" [(ngModel)]="first_name" autocomplete="off" required>
            
            <label class="auth-label" for="second_name"> Second name: </label>
            <input class="auth-input" id="second_name" type="text" name="second_name" [(ngModel)]="second_name" autocomplete="off" required>
            
            <label class="auth-label" for="birthdate"> Birthdate: </label>
            <input class="auth-input" id="birthdate" type="date" name="birthdate" [(ngModel)]="birthdate" autocomplete="off">
          </form>
        </div>
      </div>

      <div class="form-row">
        <div class="auth-buttons">
          <button class="auth-button" type="submit" form="reg">Register</button>
          <button class="auth-button" (click)="goToSignIn()" type="button">Back</button>
        </div>
      </div>
    </div>`,
  styleUrls: ["./authorization.component.css"]
})
export class RegComponent {
  email: string = ""
  first_name: string | undefined
  second_name: string | undefined
  birthdate: string = ""

  constructor(private httpService: HttpClient, private router: Router) {}

  submit() {
    this.httpService.post('//localhost:3000/reg',
      {email: this.email, first_name: this.first_name,
        second_name: this.second_name, birthdate: this.birthdate}).subscribe(
      (data) => {
        setCookie('user', JSON.stringify(data))
        this.router.navigate(['/profile'])
      },
      (error) => {
        alert("A user with this email already exists.")
        console.log(error)}
    );
  }

  goToSignIn() {
    this.router.navigate(['/sign_in']);
  }
}