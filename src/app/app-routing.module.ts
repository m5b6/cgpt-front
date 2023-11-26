import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { ContactComponent } from './contact/contact.component';
import { DisclaimerComponent } from './disclaimer/disclaimer.component';
const routes: Routes = [
  {
    path: 'chat',
    component: ChatComponent,
  },
  { path: '', redirectTo: 'chat', pathMatch: 'full' },
  { path: 'contact', component: ContactComponent },
  { path: 'disclaimer', component: DisclaimerComponent },
  { path: '**', redirectTo: 'chat' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
