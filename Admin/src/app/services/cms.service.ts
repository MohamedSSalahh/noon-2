import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CmsService {
  private apiUrl = 'http://localhost:8000/api/v1/cms'; // Adjust API URL as needed

  constructor(private http: HttpClient) { }

  getPage(slug: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${slug}`);
  }

  updatePage(slug: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${slug}`, data);
  }

  createPage(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
