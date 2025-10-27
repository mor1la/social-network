import { Component } from "@angular/core";


@Component({
  selector: "app-root",
  template: `

    <div class="container-fluid" style="text-align: center">
      <h2> Let's start </h2>

      <div class="form-row">
        <div class="text-center p-3 col-12">
          <button class="btn btn-secondary text-light my-2" id="reg_button" onclick="location.href='/sign_in'"
                  type="button"> log in
          </button>
        </div>
      </div>

    </div>

  `
})

export class WelcomeComponent {
}

