import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { PreCreationComponent } from './pre-creation/pre-creation.component';
import { PostCreationComponent } from './post-creation/post-creation.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SetPasswordComponent } from './set-password/set-password.component';
import { NumbersOnly } from './directives/number-only.directive';
import { SetTitleComponent } from './set-title/set-title.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { LobbyComponent } from './lobby/lobby.component';
import { Title } from '@angular/platform-browser';
import { FilterQuizPipe } from './shared/pipes/filter-quiz.pipe';
import { PlayQuizComponent } from './play-quiz/play-quiz.component';
import { JwPaginationComponent } from './shared/component/jw-pagination/jw-pagination.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { RegisterComponent } from './register/register.component'
import { TokenInterceptorService } from './services/token-interceptor.service';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { GetEmailComponent } from './get-email/get-email.component';
import { ProfileComponent } from './profile/profile.component';
import { SetPlayerComponent } from './set-player/set-player.component';
import { FeedBackComponent } from './feed-back/feed-back.component';
import { ResultsComponent } from './results/results.component';
import { QuizSettingsComponent } from './quiz-settings/quiz-settings.component';
import { PrimeComponentsModule } from './prime-components/prime-components.module';
import { ClipboardModule } from 'ngx-clipboard';
import { JwtModule } from "@auth0/angular-jwt";
import {MessageService} from 'primeng/api';
import { LoaderComponent } from './loader/loader.component';
import {ConfirmationService} from 'primeng/api';




@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PreCreationComponent,
    PostCreationComponent,
    SetPasswordComponent,
    NumbersOnly,
    SetTitleComponent,
    LobbyComponent,
    FilterQuizPipe,
    PlayQuizComponent,
    JwPaginationComponent,
    LoginPageComponent,
    RegisterComponent,
    ForgetPasswordComponent,
    GetEmailComponent,
    ProfileComponent,
    SetPlayerComponent,
    FeedBackComponent,
    ResultsComponent,
    QuizSettingsComponent,
    LoaderComponent,
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ClipboardModule,
    PrimeComponentsModule,
   
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorService,
    multi: true
  },
  MessageService,
  ConfirmationService

],
  bootstrap: [AppComponent]
})
export class AppModule { }
