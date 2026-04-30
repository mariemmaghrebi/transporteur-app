import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { VoyageService } from '../../services/voyage.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-ajouter-voyage',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './ajouter-voyage.component.html',
  styleUrls: ['./ajouter-voyage.component.css']
})
export class AjouterVoyageComponent implements OnInit {
  voyageForm: FormGroup;
  isLoading = false;
  messageInfo: string = '';

  constructor(
    private fb: FormBuilder,
    private voyageService: VoyageService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.voyageForm = this.fb.group({
      dateAller: ['', Validators.required],
      dateRetour: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.voyageForm.get('dateAller')?.valueChanges.subscribe(date => {
      this.verifierDate(date);
    });
  }

  verifierDate(dateAller: Date) {
    const aujourdhui = new Date();
    aujourdhui.setHours(0, 0, 0, 0);
    if (dateAller && new Date(dateAller) <= aujourdhui) {
      this.messageInfo = '⚠️ La date d\'aller doit être postérieure à aujourd\'hui';
      this.voyageForm.get('dateAller')?.setErrors({ dateInvalide: true });
    } else {
      this.messageInfo = '';
      this.voyageForm.get('dateAller')?.setErrors(null);
    }
  }

  onSubmit() {
    if (this.voyageForm.valid) {
      this.isLoading = true;
      
      const voyageData = {
        ...this.voyageForm.value,
        dateCreation: new Date(),
        statut: 'en_attente'
      };
      
      this.voyageService.createVoyage(voyageData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.snackBar.open('Voyage créé avec succès !', 'Fermer', { duration: 3000 });
          this.router.navigate(['/mes-voyages']);
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open(error.error.message || 'Erreur lors de la création', 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  annuler() {
    this.router.navigate(['/mes-voyages']);
  }
}