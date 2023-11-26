import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-citation-dialog',
  templateUrl: './citation-dialog.component.html',
  styleUrl: './citation-dialog.component.scss',
  providers: [MessageService],
})
export class CitationDialogComponent {
  constructor(public messageService: MessageService) {}
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
    this.messageService.clear();
    this.messageService.add({
      severity: 'info',
      summary: 'Copiado al portapapeles',
      detail: 'La cita ha sido copiada al portapapeles',
    });
  }
}
