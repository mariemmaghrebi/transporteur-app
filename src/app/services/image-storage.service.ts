import { Injectable } from '@angular/core';

export interface StoredImage {
  id: string;
  data: string;
  filename: string;
  type: string;
  uploadDate: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ImageStorageService {
  private storageKey = 'client_images';
  private MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB max pour tablette
  private MAX_IMAGES_PER_CLIENT = 5; // Limite de 5 images par client

  // Convertir un fichier en Base64 avec limite de taille
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      // Vérifier la taille du fichier
      if (file.size > this.MAX_FILE_SIZE) {
        reject(new Error(`L'image ne doit pas dépasser 2MB (${(file.size / 1024 / 1024).toFixed(2)}MB)`));
        return;
      }

      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Sauvegarder les images d'un client avec limite
  async saveImages(clientId: string, images: File[]): Promise<void> {
    const allImages = this.getAllImages();
    const currentImages = allImages[clientId] || [];
    
    // Vérifier la limite d'images
    if (currentImages.length + images.length > this.MAX_IMAGES_PER_CLIENT) {
      throw new Error(`Maximum ${this.MAX_IMAGES_PER_CLIENT} images par client`);
    }
    
    const newImages: StoredImage[] = [];
    for (const file of images) {
      try {
        const base64 = await this.fileToBase64(file);
        newImages.push({
          id: Date.now() + '-' + Math.random().toString(36).substr(2, 9),
          data: base64,
          filename: file.name,
          type: file.type,
          uploadDate: new Date()
        });
      } catch (error) {
        console.error('Erreur conversion image:', error);
        throw error;
      }
    }
    
    allImages[clientId] = [...currentImages, ...newImages];
    localStorage.setItem(this.storageKey, JSON.stringify(allImages));
  }

  getImages(clientId: string): StoredImage[] {
    const allImages = this.getAllImages();
    return allImages[clientId] || [];
  }

  deleteImage(clientId: string, imageId: string): void {
    const allImages = this.getAllImages();
    if (allImages[clientId]) {
      allImages[clientId] = allImages[clientId].filter(img => img.id !== imageId);
      localStorage.setItem(this.storageKey, JSON.stringify(allImages));
    }
  }

  deleteAllImages(clientId: string): void {
    const allImages = this.getAllImages();
    delete allImages[clientId];
    localStorage.setItem(this.storageKey, JSON.stringify(allImages));
  }

  private getAllImages(): { [key: string]: StoredImage[] } {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : {};
  }
}