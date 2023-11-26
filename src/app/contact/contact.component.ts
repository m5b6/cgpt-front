import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  onSubmit(form: NgForm) {
    console.log('Form Data: ', form.value);
    // Handle form submission logic here, e.g., send data to the server
  }
}
