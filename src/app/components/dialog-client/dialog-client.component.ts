import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { VoyageService, Client } from '../../services/voyage.service';
import { PointGeographiqueService, PointGeographique } from '../../services/point-geographique.service';

@Component({
  selector: 'app-dialog-client',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  templateUrl: './dialog-client.component.html',
  styleUrls: ['./dialog-client.component.css']
})
export class DialogClientComponent implements OnInit {
  clientForm: FormGroup;
  isLoading = false;
  pointsGeographiques: PointGeographique[] = [];
  isEditMode = false;
  clientId: string | null = null;
  
  // Gestion des images
 existingImages: Array<{ filename: string; url: string }> = [];
  newImages: File[] = [];
  imagesToDelete: string[] = [];
  previewUrls: string[] = [];

  constructor(
    private fb: FormBuilder,
    private voyageService: VoyageService,
    private pointService: PointGeographiqueService,
    private dialogRef: MatDialogRef<DialogClientComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { voyageId: string; client?: Client }
  ) {
    this.isEditMode = !!data.client;
    this.clientId = data.client?._id || null;
    
    this.clientForm = this.fb.group({
      expediteurNom: ['', Validators.required],
      expediteurPrenom: ['', Validators.required],
      expediteurTelephone: ['', Validators.required],
      destinataireNom: ['', Validators.required],
      destinatairePrenom: ['', Validators.required],
      destinataireTelephone: ['', Validators.required],
      pointGeo: ['', Validators.required],
      nombrePieces: [1, [Validators.required, Validators.min(1)]],
      totalMontant: [0, [Validators.required, Validators.min(0)]],
      statutPaiement: ['non_paye', Validators.required],
      devise: ['EUR', Validators.required]
    });
    
    if (this.isEditMode && data.client) {
      this.prefillForm(data.client);
      this.loadExistingImages(data.client);
    }
  }

  ngOnInit() {
    this.chargerPointsGeographiques();
  }

  prefillForm(client: Client) {
    this.clientForm.patchValue({
      expediteurNom: client.expediteur.nom,
      expediteurPrenom: client.expediteur.prenom,
      expediteurTelephone: client.expediteur.telephone,
      destinataireNom: client.destinataire.nom,
      destinatairePrenom: client.destinataire.prenom,
      destinataireTelephone: client.destinataire.telephone,
      pointGeo: client.pointGeo,
      nombrePieces: client.nombrePieces,
      totalMontant: client.totalMontant,
      statutPaiement: client.statutPaiement,
      devise: client.devise || 'EUR'
    });
  }

loadExistingImages(client: Client) {
  if (client.images && client.images.length > 0) {
    this.existingImages = client.images.map(img => ({
      filename: img.filename,
      url: `https://transporteur-backend.onrender.com/uploads/${img.filename}`  // ← Changé
    }));
  }
}
  chargerPointsGeographiques() {
    this.pointService.getAll().subscribe({
      next: (data) => {
        this.pointsGeographiques = data;
      },
      error: (error) => {
        this.snackBar.open('Erreur lors du chargement des points', 'Fermer', { duration: 3000 });
      }
    });
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        this.newImages.push(file);
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewUrls.push(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        this.snackBar.open('Seules les images sont autorisées', 'Fermer', { duration: 3000 });
      }
    }
    event.target.value = '';
  }

  removeNewImage(index: number) {
    this.newImages.splice(index, 1);
    this.previewUrls.splice(index, 1);
  }

markImageForDelete(filename: string) {
  this.imagesToDelete.push(filename);
  this.existingImages = this.existingImages.filter(img => img.filename !== filename);
}

  async onSubmit() {
    if (this.clientForm.valid) {
      this.isLoading = true;
      
      const clientData: any = {
        expediteur: {
          nom: this.clientForm.value.expediteurNom,
          prenom: this.clientForm.value.expediteurPrenom,
          telephone: this.clientForm.value.expediteurTelephone
        },
        destinataire: {
          nom: this.clientForm.value.destinataireNom,
          prenom: this.clientForm.value.destinatairePrenom,
          telephone: this.clientForm.value.destinataireTelephone
        },
        pointGeo: this.clientForm.value.pointGeo,
        nombrePieces: this.clientForm.value.nombrePieces,
        totalMontant: this.clientForm.value.totalMontant,
        statutPaiement: this.clientForm.value.statutPaiement,
        devise: this.clientForm.value.devise 
      };
      
      if (this.isEditMode && this.clientId) {
        // Supprimer les images marquées
        for (const imageId of this.imagesToDelete) {
          await this.voyageService.deleteImage(this.clientId, imageId).toPromise();
        }
        
        // Ajouter les nouvelles images
        for (const file of this.newImages) {
          await this.voyageService.uploadImage(this.clientId, file).toPromise();
        }
        
        // Mettre à jour les infos du client
        this.voyageService.updateClient(this.clientId, clientData).subscribe({
          next: () => {
            this.isLoading = false;
            this.snackBar.open('Client modifié avec succès !', 'Fermer', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.isLoading = false;
            this.snackBar.open(error.error.message || 'Erreur lors de la modification', 'Fermer', { duration: 3000 });
          }
        });
      } else {
        // Mode ajout
        clientData.date = new Date();
        clientData.matricule = this.genererMatricule();
        
        this.voyageService.addClient(this.data.voyageId, clientData).subscribe({
          next: async (client) => {
            // Upload des images
            for (const file of this.newImages) {
              try {
                await this.voyageService.uploadImage(client._id!, file).toPromise();
              } catch (error) {
                console.error('Erreur upload image:', error);
              }
            }
            
            this.isLoading = false;
            this.snackBar.open('Client ajouté avec succès !', 'Fermer', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.isLoading = false;
            this.snackBar.open(error.error.message || 'Erreur lors de l\'ajout', 'Fermer', { duration: 3000 });
          }
        });
      }
    }
  }

  genererMatricule(): string {
    const date = new Date();
    const annee = date.getFullYear();
    const mois = (date.getMonth() + 1).toString().padStart(2, '0');
    const jour = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `CLT-${annee}${mois}${jour}-${random}`;
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}