import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-citation-dialog',
  templateUrl: './citation-dialog.component.html',
  styleUrl: './citation-dialog.component.scss',
})
export class CitationDialogComponent {
  citation: string = '';
  open() {
    console.log('abriendo fr!');
    const dialog: any = document.getElementById('citationDialog');
    if (dialog) {
      dialog.showModal();
    }
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }
}
