import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Button, ButtonModule } from 'primeng/button';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from './navbar/navbar.component';
import { MenubarModule } from 'primeng/menubar';
import { FlexModule } from '@angular/flex-layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { CitationDialogComponent } from './citation-dialog/citation-dialog.component';
import { DecorativeChileComponent } from './decorative-chile/decorative-chile.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ContactComponent } from './contact/contact.component';
import { InputTextModule } from 'primeng/inputtext';


@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    NavbarComponent,
    CitationDialogComponent,
    DecorativeChileComponent,
    ContactComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    InputTextareaModule,
    ButtonModule,
    FormsModule,
    MenubarModule,
    FlexModule,
    FlexLayoutModule,
    HttpClientModule,
    CommonModule,
    TooltipModule,
    DialogModule,
    ToastModule,
    InputTextModule,
    
  ],
  exports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    InputTextareaModule,
    ButtonModule,
    FormsModule,
    MenubarModule,
    FlexModule,
    FlexLayoutModule,
    HttpClientModule,
    CommonModule,
    TooltipModule,
    DialogModule,
    MatDialogModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
