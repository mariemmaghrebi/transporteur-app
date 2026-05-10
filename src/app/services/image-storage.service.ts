import { Injectable } from '@angular/core';

export interface StoredImage {
  id: string;
  data: string;      // Base64 string
  filename: string;
  type: string;
  uploadDate: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ImageStorageService {
  private storageKey = 'client_images';
  
  // Convertir un fichier en Base64
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  
  // Sauvegarder les images d'un client
  async saveImages(clientId: string, images: File[]): Promise<void> {
    const allImages = this.getAllImages();
    
    const newImages: StoredImage[] = [];
    for (const file of images) {
      const base64 = await this.fileToBase64(file);
      newImages.push({
        id: Date.now() + '-' + Math.random().toString(36).substr(2, 9),
        data: base64,
        filename: file.name,
        type: file.type,
        uploadDate: new Date()
      });
    }
    
    allImages[clientId] = [...(allImages[clientId] || []), ...newImages];
    localStorage.setItem(this.storageKey, JSON.stringify(allImages));
  }
  
  // Récupérer les images d'un client
  getImages(clientId: string): StoredImage[] {
    const allImages = this.getAllImages();
    return allImages[clientId] || [];
  }
  
  // Supprimer une image spécifique
  deleteImage(clientId: string, imageId: string): void {
    const allImages = this.getAllImages();
    if (allImages[clientId]) {
      allImages[clientId] = allImages[clientId].filter(img => img.id !== imageId);
      localStorage.setItem(this.storageKey, JSON.stringify(allImages));
    }
  }
  
  // Supprimer toutes les images d'un client
  deleteAllImages(clientId: string): void {
    const allImages = this.getAllImages();
    delete allImages[clientId];
    localStorage.setItem(this.storageKey, JSON.stringify(allImages));
  }
  
  // Récupérer toutes les images
  private getAllImages(): { [key: string]: StoredImage[] } {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : {};
  }
}