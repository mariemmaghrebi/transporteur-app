import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Voyage {
  _id?: string;
  matricule: string;
  dateCreation?: Date;
  dateAller: Date;
  dateRetour: Date;
  statut: string;
  clients?: Client[];
}

export interface Client {
  _id?: string;
  voyageId?: string;
  date: Date;
  matricule: string;
  expediteur: {
    nom: string;
    prenom: string;
    telephone: string;
  };
  destinataire: {
    nom: string;
    prenom: string;
    telephone: string;
  };
  pointGeo: string;
  nombrePieces: number;
  totalMontant: number;
  statutPaiement: string;
  devise?: string;
  images: Array<{ url: string; filename: string; _id?: string }>;
}

@Injectable({
  providedIn: 'root'
})
export class VoyageService {
  private apiUrl = 'https://transporteur-backend.onrender.com/api/voyages';

  constructor(private http: HttpClient) {}

  // VOYAGES
  getVoyages(): Observable<Voyage[]> {
    return this.http.get<Voyage[]>(this.apiUrl);
  }

  getVoyage(id: string): Observable<Voyage> {
    return this.http.get<Voyage>(`${this.apiUrl}/${id}`);
  }

  createVoyage(voyage: Voyage): Observable<Voyage> {
    return this.http.post<Voyage>(this.apiUrl, voyage);
  }

  updateVoyage(id: string, voyage: Partial<Voyage>): Observable<Voyage> {
    return this.http.put<Voyage>(`${this.apiUrl}/${id}`, voyage);
  }

  deleteVoyage(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // CLIENTS
  getClients(voyageId: string): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/${voyageId}/clients`);
  }

  addClient(voyageId: string, client: Client): Observable<Client> {
    return this.http.post<Client>(`${this.apiUrl}/${voyageId}/clients`, client);
  }

  updateClient(clientId: string, client: Partial<Client>): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/clients/${clientId}`, client);
  }

  deleteClient(clientId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clients/${clientId}`);
  }

 uploadImage(clientId: string, file: File): Observable<any> {
  const formData = new FormData();
  formData.append('image', file);
  return this.http.post(`https://transporteur-backend.onrender.com/api/voyages/clients/${clientId}/upload`, formData);
}

  deleteImage(clientId: string, imageId: string): Observable<any> {
    return this.http.delete(`https://transporteur-backend.onrender.com/api/voyages/clients/${clientId}/images/${imageId}`);
  }
}