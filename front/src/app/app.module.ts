import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from "@angular/common/http";

import {AppRoutingModule} from './app-routing.module';
import {RouterModule, Routes} from "@angular/router";
import {Log_inComponent} from "./authorization/log_in.component";
import {BaseComponent} from "./base/base.component";
import {RegComponent} from "./authorization/reg.component";
import {ProfileComponent} from "./profile/profile.component";
import {Profile_baseComponent} from "./profile_base/profile_base.component";
import {WelcomeComponent} from "./welcome/welcome.component";
import {FormsModule} from "@angular/forms";
import {NgOptimizedImage} from "@angular/common";
import {FriendsComponent} from "./friends/friends.component";
import {Find_friendsComponent} from "./find_friends/find_friends.component";
import {Add_newsComponent} from "./add_news/add_news.component";
import {NewsComponent} from "./news/news.component";
import {MessageComponent} from "./message/message.component";
import {MessageUserComponent} from "./messageUser/messageUser.component";


const routes: Routes = [
    {path: '', component: WelcomeComponent},
    {path: 'sign_in', component: Log_inComponent},
    {path: 'reg', component: RegComponent},
    {path: 'profile', component: ProfileComponent},
    {path: 'friends', component: FriendsComponent},
    {path: 'add_friend', component: Find_friendsComponent},
    {path: 'add_news', component: Add_newsComponent},
    {path: 'news', component: NewsComponent},
    {path: 'messages', component: MessageComponent},
    {path: 'message/:id', component: MessageUserComponent},

]

@NgModule({
    declarations: [
        WelcomeComponent,
        BaseComponent,
        Log_inComponent,
        RegComponent,
        Profile_baseComponent,
        ProfileComponent,
        FriendsComponent,
        Find_friendsComponent,
        Add_newsComponent,
        NewsComponent,
        MessageComponent,
        MessageUserComponent
    ],
    imports: [
        HttpClientModule,
        BrowserModule,
        AppRoutingModule,
        RouterModule.forRoot(routes),
        FormsModule,
        NgOptimizedImage
    ],
    providers: [],
    bootstrap: [BaseComponent],
    exports: [RouterModule]
})
export class AppModule {
}
