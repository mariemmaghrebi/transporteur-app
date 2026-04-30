import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { VoyageService, Client } from '../../services/voyage.service';
import { AuthService } from '../../services/auth.service';
import { PointGeographiqueService, PointGeographique } from '../../services/point-geographique.service';
import { DialogClientComponent } from '../dialog-client/dialog-client.component';
import { ImageGalleryComponent } from '../image-gallery/image-gallery/image-gallery.component';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {
  @Input() voyageId!: string;
  @Input() voyageStatut?: string;
  clients: Client[] = [];
  clientsFiltres: Client[] = [];
  pointsGeographiques: PointGeographique[] = [];
  
  // Filtres
  filtrePointGeo: string = '';
  filtreNomPrenom: string = '';
  
  displayedColumns: string[] = ['matricule', 'expediteur', 'destinataire', 'nombrePieces', 'totalMontant', 'statutPaiement', 'images', 'actions'];

  constructor(
    private voyageService: VoyageService,
    private authService: AuthService,
    private pointService: PointGeographiqueService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadClients();
    this.loadPointsGeographiques();
  }
get voyageEstTermine(): boolean {
    return this.voyageStatut === 'termine' && !this.authService.isSuperAdmin();
  }
  loadClients() {
    if (!this.voyageId) {
      console.error('Pas de voyageId');
      return;
    }
    
    this.voyageService.getClients(this.voyageId).subscribe({
      next: (data) => {
        this.clients = data;
        this.appliquerFiltres();
      },
      error: (error) => {
        this.snackBar.open('Erreur lors du chargement des clients', 'Fermer', { duration: 3000 });
      }
    });
  }

  
  loadPointsGeographiques() {
    this.pointService.getAll().subscribe({
      next: (data) => {
        this.pointsGeographiques = data;
      },
      error: (error) => {
        console.error('Erreur chargement points:', error);
      }
    });
  }

  appliquerFiltres() {
    this.clientsFiltres = this.clients.filter(client => {
      // Filtre par point géographique
      const matchPointGeo = !this.filtrePointGeo || client.pointGeo === this.filtrePointGeo;
      
      // Filtre par nom/prénom (expéditeur ou destinataire)
      const searchTerm = this.filtreNomPrenom.toLowerCase();
      const matchNomPrenom = !searchTerm || 
        client.expediteur.nomPrenom.toLowerCase().includes(searchTerm) ||
        client.destinataire.nomPrenom.toLowerCase().includes(searchTerm);
      
      return matchPointGeo && matchNomPrenom;
    });
  }

  onFiltreChange() {
    this.appliquerFiltres();
  }

  resetFiltres() {
    this.filtrePointGeo = '';
    this.filtreNomPrenom = '';
    this.appliquerFiltres();
  }

  // Ajoute cette méthode pour obtenir l'URL de l'image
getImageUrl(clientId: string, imageId: string): string {
  return `https://transporteur-backend.onrender.com/api/voyages/clients/${clientId}/images/${imageId}`;
}

  getPointGeoNom(pointId: string): string {
    const point = this.pointsGeographiques.find(p => p._id === pointId);
    return point ? point.nom : pointId;
  }

openImageViewer(client: Client) {
  if (!client.images || client.images.length === 0) return;
  
  // Utilisation de img._id au lieu de img.id
  const images = client.images.map(img => 
    `https://transporteur-backend.onrender.com/api/voyages/clients/${client._id}/images/${img._id}`
  );
  
  this.dialog.open(ImageGalleryComponent, {
    data: { 
      images: images,
      clientName: client.expediteur.nomPrenom
    },
    width: '90%',
    maxWidth: '1200px'
  });
}
  openAddClientDialog() {
    const dialogRef = this.dialog.open(DialogClientComponent, {
      width: '600px',
      data: { voyageId: this.voyageId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadClients();
      }
    });
  }

  editClient(client: Client) {
    const dialogRef = this.dialog.open(DialogClientComponent, {
      width: '600px',
      data: { voyageId: this.voyageId, client: client }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadClients();
      }
    });
  }

  deleteClient(clientId: string | undefined) {
    if (!clientId) return;
    
    if (confirm('Voulez-vous vraiment supprimer ce client ?')) {
      this.voyageService.deleteClient(clientId).subscribe({
        next: () => {
          this.snackBar.open('Client supprimé avec succès', 'Fermer', { duration: 3000 });
          this.loadClients();
        },
        error: (error) => {
          this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  deleteImage(clientId: string | undefined, image: any, event: Event) {
    event.stopPropagation();
    if (!clientId) return;
    
    if (confirm('Supprimer cette image ?')) {
      this.voyageService.deleteImage(clientId, image.id).subscribe({
        next: () => {
          this.snackBar.open('Image supprimée', 'Fermer', { duration: 3000 });
          this.loadClients();
        },
        error: (error) => {
          this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
        }
      });
    }
  }
}