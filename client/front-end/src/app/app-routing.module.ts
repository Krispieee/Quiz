import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PreCreationComponent } from './pre-creation/pre-creation.component';
import { PostCreationComponent } from './post-creation/post-creation.component';
import { LobbyComponent } from './lobby/lobby.component';
import { PlayQuizComponent } from './play-quiz/play-quiz.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { AuthGuard } from './auth.guard';
import { RegisterComponent } from './register/register.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ProfileComponent } from './profile/profile.component';
import { FeedBackComponent } from './feed-back/feed-back.component';
import { ResultsComponent } from './results/results.component';
import { QuizSettingsComponent } from './quiz-settings/quiz-settings.component';


const routes: Routes = [
  {
    path:'',
    redirectTo:'/home',
    pathMatch:'full'
  },
  {
    path:'home',
    component:HomeComponent
  },
  {
    path:'pre-creation',
    component:PreCreationComponent,
    canActivate:[AuthGuard],
    data:{title:'Quiz | pre-creation'}
  },
  {
    path:'post-creation/:id/:password',
    component:PostCreationComponent,
    canActivate:[AuthGuard],
    data:{title:'Quiz | post-creation'}
  },
  {
    canActivate:[AuthGuard],
    component:PostCreationComponent,
    path:'post-creation/:id',
    data:{title:'Quiz | post-creation'}

  },
  {
    path:'lobby',
    component:LobbyComponent,
    data:{title:'Quiz | Lobby'}
  },
  {
    path:'play-quiz/:id/:password',
    component:PlayQuizComponent,
    data:{title:'Quiz | Play'}
  },
  {
    path:'play-quiz/:id',
    component:PlayQuizComponent,
    data:{title:'Quiz | Play'}
  },
  {
    path:'login',
    component:LoginPageComponent,
    data:{title:'Quiz | login'}
  },
  {
    path:'register',
    component:RegisterComponent,
    data:{title:'Quiz | register'}
  },
  {
    path:'forgot-password/:email/:token',
    component:ForgetPasswordComponent,
    data:{title:'Quiz | register'}
  },
  {
    canActivate:[AuthGuard],
    path:'profile',
    component:ProfileComponent,
    data:{title:'Quiz | profile'}
  },
  {
    path:'feedback/:quiz_id',
    component:FeedBackComponent,
    data:{title:'Quiz | feedback'}
  },
  {
    path:'feedback',
    component:FeedBackComponent,
    data:{title:'Quiz | feedback'}
  },
  {
    path:'results/:quiz_id',
    component:ResultsComponent,
    data:{title:'Quiz | results'}
  },
  {
    path:'settings/:quiz_id',
    component:QuizSettingsComponent,
    data:{title:'Quiz | settings'}
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
