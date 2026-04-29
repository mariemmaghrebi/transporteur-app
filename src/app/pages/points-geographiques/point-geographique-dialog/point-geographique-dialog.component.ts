import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { PointGeographique } from '../../../services/point-geographique.service';

@Component({
  selector: 'app-point-geographique-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.mode === 'ajout' ? 'Ajouter un point géographique' : 'Modifier le point' }}</h2>
    <mat-dialog-content>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Nom du point géographique *</mat-label>
        <input matInput [(ngModel)]="point.nom" required autofocus>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="annuler()">Annuler</button>
      <button mat-raised-button color="primary" (click)="valider()" [disabled]="!point.nom">
        {{ data.mode === 'ajout' ? 'Ajouter' : 'Modifier' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
    }
    mat-dialog-content {
      min-height: 100px;
      padding: 20px 0;
    }
  `]
})
export class PointGeographiqueDialogComponent {
  point: Partial<PointGeographique> = {};

  constructor(
    public dialogRef: MatDialogRef<PointGeographiqueDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: string; point?: PointGeographique }
  ) {
    if (data.mode === 'modifier' && data.point) {
      this.point = { ...data.point };
    } else {
      this.point = { nom: '' };
    }
  }

  valider() {
    if (this.point.nom) {
      this.dialogRef.close(this.point);
    }
  }

  annuler() {
    this.dialogRef.close();
  }
}