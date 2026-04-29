import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PointGeographiqueService, PointGeographique } from '../../services/point-geographique.service';
import { PointGeographiqueDialogComponent } from './point-geographique-dialog/point-geographique-dialog.component';

@Component({
  selector: 'app-points-geographiques',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatIconModule, 
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './points-geographiques.component.html',
  styleUrls: ['./points-geographiques.component.css']
})
export class PointsGeographiquesComponent implements OnInit {
  points: PointGeographique[] = [];

  constructor(
    private pointService: PointGeographiqueService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.chargerPoints();
  }

  chargerPoints() {
    this.pointService.getAll().subscribe({
      next: (data) => {
        this.points = data;
      },
      error: (error) => {
        this.snackBar.open('Erreur lors du chargement', 'Fermer', { duration: 3000 });
      }
    });
  }

  ouvrirPopupAjout() {
    const dialogRef = this.dialog.open(PointGeographiqueDialogComponent, {
      width: '450px',
      data: { mode: 'ajout' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.pointService.create(result).subscribe({
          next: () => {
            this.snackBar.open('Point géographique ajouté !', 'Fermer', { duration: 3000 });
            this.chargerPoints();
          },
          error: (error) => {
            this.snackBar.open('Erreur lors de l\'ajout', 'Fermer', { duration: 3000 });
          }
        });
      }
    });
  }

  modifierPoint(point: PointGeographique) {
    const dialogRef = this.dialog.open(PointGeographiqueDialogComponent, {
      width: '450px',
      data: { mode: 'modifier', point: point }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && point._id) {
        this.pointService.update(point._id, result).subscribe({
          next: () => {
            this.snackBar.open('Point modifié !', 'Fermer', { duration: 3000 });
            this.chargerPoints();
          },
          error: (error) => {
            this.snackBar.open('Erreur lors de la modification', 'Fermer', { duration: 3000 });
          }
        });
      }
    });
  }

  supprimerPoint(id: string) {
    if (confirm('Voulez-vous vraiment supprimer ce point géographique ?')) {
      this.pointService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Point supprimé !', 'Fermer', { duration: 3000 });
          this.chargerPoints();
        },
        error: (error) => {
          this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
        }
      });
    }
  }
}