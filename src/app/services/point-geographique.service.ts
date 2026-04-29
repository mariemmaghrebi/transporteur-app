import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PointGeographique {
  _id?: string;
  nom: string;
  userId?: string;
  createdAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class PointGeographiqueService {
private apiUrl = 'https://transporteur-backend.onrender.com/api/points-geographiques';
  constructor(private http: HttpClient) {}

  getAll(): Observable<PointGeographique[]> {
    return this.http.get<PointGeographique[]>(this.apiUrl);
  }

  create(point: PointGeographique): Observable<PointGeographique> {
    return this.http.post<PointGeographique>(this.apiUrl, point);
  }

  update(id: string, point: Partial<PointGeographique>): Observable<PointGeographique> {
    return this.http.put<PointGeographique>(`${this.apiUrl}/${id}`, point);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}