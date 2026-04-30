import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-image-gallery',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="gallery-container">
      <div class="gallery-header">
        <h2>Images - {{ data.clientName }}</h2>
        <button mat-icon-button (click)="close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      
      <div class="gallery-content" *ngIf="data.images && data.images.length > 0">
        <button mat-icon-button class="nav-btn prev" (click)="prevImage()" [disabled]="currentIndex === 0">
          <mat-icon>chevron_left</mat-icon>
        </button>
        
        <div class="main-image">
          <img [src]="data.images[currentIndex]" [alt]="'Image ' + (currentIndex + 1)" (error)="onImageError(currentIndex)">
        </div>
        
        <button mat-icon-button class="nav-btn next" (click)="nextImage()" [disabled]="currentIndex === data.images.length - 1">
          <mat-icon>chevron_right</mat-icon>
        </button>
      </div>
      
      <div class="gallery-footer" *ngIf="data.images && data.images.length > 0">
        <div class="thumbnails">
          <div *ngFor="let img of data.images; let i = index" 
               class="thumbnail" 
               [class.active]="i === currentIndex"
               (click)="goToImage(i)">
            <img [src]="img" [alt]="'Miniature ' + (i + 1)" (error)="onThumbnailError(i)">
          </div>
        </div>
        <div class="image-counter">
          {{ currentIndex + 1 }} / {{ data.images.length }}
        </div>
      </div>
      
      <div class="no-images" *ngIf="!data.images || data.images.length === 0">
        <mat-icon>image_not_supported</mat-icon>
        <p>Aucune image disponible</p>
      </div>
    </div>
  `,
  styles: [`
    .gallery-container {
      background: #1a1a1a;
      border-radius: 12px;
      overflow: hidden;
      min-width: 300px;
      max-width: 90vw;
    }
    
    .gallery-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      background: #2d2d2d;
      color: white;
    }
    
    .gallery-header h2 {
      margin: 0;
      font-size: 18px;
    }
    
    .gallery-content {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      min-height: 400px;
      position: relative;
    }
    
    .main-image {
      flex: 1;
      text-align: center;
      max-height: 60vh;
    }
    
    .main-image img {
      max-width: 100%;
      max-height: 60vh;
      object-fit: contain;
    }
    
    .nav-btn {
      position: absolute;
      background: rgba(255,255,255,0.2);
      color: white;
    }
    
    .nav-btn:hover:not(:disabled) {
      background: rgba(255,255,255,0.4);
    }
    
    .nav-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
    
    .prev {
      left: 10px;
    }
    
    .next {
      right: 10px;
    }
    
    .gallery-footer {
      padding: 16px 20px;
      background: #2d2d2d;
    }
    
    .thumbnails {
      display: flex;
      gap: 10px;
      overflow-x: auto;
      padding-bottom: 10px;
      justify-content: center;
      flex-wrap: wrap;
    }
    
    .thumbnail {
      width: 60px;
      height: 60px;
      cursor: pointer;
      border-radius: 6px;
      overflow: hidden;
      border: 2px solid transparent;
      transition: all 0.2s;
    }
    
    .thumbnail.active {
      border-color: #f59e0b;
      transform: scale(1.05);
    }
    
    .thumbnail img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .image-counter {
      text-align: center;
      margin-top: 10px;
      color: #9ca3af;
      font-size: 14px;
    }
    
    .no-images {
      text-align: center;
      padding: 60px;
      color: #9ca3af;
    }
    
    .no-images mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }
  `]
})
export class ImageGalleryComponent {
  currentIndex = 0;

  constructor(
    public dialogRef: MatDialogRef<ImageGalleryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { images: string[], clientName: string }
  ) {}

  prevImage() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  nextImage() {
    if (this.currentIndex < this.data.images.length - 1) {
      this.currentIndex++;
    }
  }

  goToImage(index: number) {
    this.currentIndex = index;
  }

onImageError() {
  console.error('Erreur chargement image dans la galerie');
}

  onThumbnailError(index: number) {
    console.error(`Erreur chargement miniature ${index}: ${this.data.images[index]}`);
  }

  close() {
    this.dialogRef.close();
  }
}