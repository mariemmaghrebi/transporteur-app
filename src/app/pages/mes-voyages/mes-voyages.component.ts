import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { VoyageService, Voyage } from '../../services/voyage.service';
import { AuthService } from '../../services/auth.service';
import { ClientListComponent } from '../../components/client-list/client-list.component';

@Component({
  selector: 'app-mes-voyages',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    ClientListComponent
  ],
  templateUrl: './mes-voyages.component.html',
  styleUrls: ['./mes-voyages.component.css']
})
export class MesVoyagesComponent implements OnInit {
  voyages: Voyage[] = [];
  voyageSelectionne: Voyage | null = null;
  aUnVoyageEnAttente = false;

  constructor(
    private voyageService: VoyageService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.chargerVoyages();
  }

  chargerVoyages() {
    this.voyageService.getVoyages().subscribe({
      next: (data) => {
        this.voyages = data;
        this.verifierVoyageEnAttente();
      },
      error: (error) => {
        this.snackBar.open('Erreur lors du chargement', 'Fermer', { duration: 3000 });
      }
    });
  }

  verifierVoyageEnAttente() {
    const aujourdhui = new Date();
    aujourdhui.setHours(0, 0, 0, 0);
    
    this.aUnVoyageEnAttente = this.voyages.some(voyage => {
      const dateAller = new Date(voyage.dateAller);
      dateAller.setHours(0, 0, 0, 0);
      return dateAller > aujourdhui;
    });
  }

  calculerStatut(dateAller: Date): string {
    const aujourdhui = new Date();
    aujourdhui.setHours(0, 0, 0, 0);
    const dateAllerObj = new Date(dateAller);
    dateAllerObj.setHours(0, 0, 0, 0);
    
    return dateAllerObj <= aujourdhui ? 'termine' : 'en_attente';
  }

  getStatutText(statut: string): string {
    return statut === 'en_attente' ? 'En attente' : 'Terminé';
  }

  peutAjouterVoyage(): boolean {
    if (this.authService.isSuperAdmin()) return true;
    return !this.aUnVoyageEnAttente;
  }

  peutModifierVoyage(voyage: Voyage): boolean {
    if (this.authService.isSuperAdmin()) return true;
    return voyage.statut !== 'termine';
  }

  peutSupprimerVoyage(voyage: Voyage): boolean {
    if (this.authService.isSuperAdmin()) return true;
    return voyage.statut !== 'termine';
  }

  voirClients(voyage: Voyage) {
    this.voyageSelectionne = voyage;
  }

  fermerClients() {
    this.voyageSelectionne = null;
    this.chargerVoyages();
  }

  modifierVoyage(voyage: Voyage) {
    if (!this.peutModifierVoyage(voyage)) {
      this.snackBar.open('Ce voyage est terminé. Vous ne pouvez plus le modifier.', 'Fermer', { duration: 3000 });
      return;
    }
    
    const dialogRef = this.dialog.open(VoyageEditDialogComponent, {
      width: '500px',
      data: { voyage: { ...voyage } }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.chargerVoyages();
      }
    });
  }

  supprimerVoyage(id: string, voyage: Voyage) {
    if (!this.peutSupprimerVoyage(voyage)) {
      this.snackBar.open('Vous ne pouvez pas supprimer un voyage terminé.', 'Fermer', { duration: 3000 });
      return;
    }
    
    if (confirm('Voulez-vous vraiment supprimer ce voyage ?')) {
      this.voyageService.deleteVoyage(id).subscribe({
        next: () => {
          this.snackBar.open('Voyage supprimé avec succès', 'Fermer', { duration: 3000 });
          this.chargerVoyages();
          if (this.voyageSelectionne?._id === id) {
            this.voyageSelectionne = null;
          }
        },
        error: (error) => {
          this.snackBar.open(error.error.message || 'Erreur lors de la suppression', 'Fermer', { duration: 3000 });
        }
      });
    }
  }
}

// ==================== COMPOSANT DIALOG DE MODIFICATION ====================
@Component({
  selector: 'app-voyage-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  template: `
    <div class="dialog-header">
      <h2>Modifier le voyage {{ data.voyage.matricule }}</h2>
      <button mat-icon-button (click)="close()">
        <mat-icon class='close-icon'>close</mat-icon>
      </button>
    </div>
    <div class="dialog-content">
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Date d'aller</mat-label>
        <input matInput [matDatepicker]="pickerAller" [(ngModel)]="data.voyage.dateAller" (dateChange)="onDateChange()">
        <mat-datepicker-toggle matSuffix [for]="pickerAller"></mat-datepicker-toggle>
        <mat-datepicker #pickerAller></mat-datepicker>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Date de retour</mat-label>
        <input matInput [matDatepicker]="pickerRetour" [(ngModel)]="data.voyage.dateRetour">
        <mat-datepicker-toggle matSuffix [for]="pickerRetour"></mat-datepicker-toggle>
        <mat-datepicker #pickerRetour></mat-datepicker>
      </mat-form-field>

      <div class="statut-info">
        <mat-icon>info</mat-icon>
        <span>Statut calculé: <strong>{{ getStatutText(calculerStatut()) }}</strong></span>
      </div>
      
      <div *ngIf="!isSuperAdmin && data.voyage.statut === 'termine'" class="warning-info">
        <mat-icon>lock</mat-icon>
        <span>Voyage terminé - Modification impossible</span>
      </div>
    </div>
    <div class="dialog-footer">
      <button mat-button (click)="close()">Annuler</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="isLoading || (!isSuperAdmin && data.voyage.statut === 'termine')">
        {{ isLoading ? 'Enregistrement...' : 'Enregistrer' }}
      </button>
    </div>
  `,
  styles: [`
    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      background: #064F82;
      color: white;
    }
    .close-icon { color: white; }
    .dialog-header h2 { margin: 0; font-size: 18px; }
    .dialog-content { padding: 20px; }
    .full-width { width: 100%; margin-bottom: 16px; }
    .statut-info {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      background: #e0e7ff;
      border-radius: 8px;
      margin-top: 16px;
    }
    .warning-info {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      background: #fee2e2;
      color: #dc2626;
      border-radius: 8px;
      margin-top: 16px;
    }
    .dialog-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 16px 20px;
      border-top: 1px solid #e5e7eb;
    }
  `]
})
export class VoyageEditDialogComponent {
  isLoading = false;
  isSuperAdmin = false;

  constructor(
    public dialogRef: MatDialogRef<VoyageEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { voyage: Voyage },
    private voyageService: VoyageService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.isSuperAdmin = this.authService.isSuperAdmin();
  }

  calculerStatut(): string {
    const aujourdhui = new Date();
    aujourdhui.setHours(0, 0, 0, 0);
    const dateAller = new Date(this.data.voyage.dateAller);
    dateAller.setHours(0, 0, 0, 0);
    
    return dateAller <= aujourdhui ? 'termine' : 'en_attente';
  }

  getStatutText(statut: string): string {
    return statut === 'en_attente' ? 'En attente' : 'Terminé';
  }

  onDateChange() {
    this.data.voyage.statut = this.calculerStatut();
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    if (!this.isSuperAdmin && this.data.voyage.statut === 'termine') {
      this.snackBar.open('Ce voyage est terminé. Vous ne pouvez pas le modifier.', 'Fermer', { duration: 3000 });
      return;
    }
    
    this.isLoading = true;
    const nouveauStatut = this.calculerStatut();
    
    const updateData = {
      dateAller: this.data.voyage.dateAller,
      dateRetour: this.data.voyage.dateRetour,
      statut: nouveauStatut
    };
    
    this.voyageService.updateVoyage(this.data.voyage._id!, updateData).subscribe({
      next: () => {
        this.isLoading = false;
        this.snackBar.open('Voyage modifié avec succès !', 'Fermer', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open(error.error.message || 'Erreur lors de la modification', 'Fermer', { duration: 3000 });
      }
    });
  }
}