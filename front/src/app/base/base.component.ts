import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  template: `
    <h1>Социальная сеть</h1>
    <router-outlet></router-outlet>
  `,
  styleUrls: ["../../styles.css"] 
})
export class BaseComponent {
}