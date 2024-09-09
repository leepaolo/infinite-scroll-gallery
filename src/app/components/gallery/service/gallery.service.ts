import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, BehaviorSubject, finalize } from 'rxjs';
import { environment } from 'src/enviroments/enviroments';

@Injectable({
  providedIn: 'root',
})
export class GalleryService {
  private readonly apiUrl = environment.API_BASE_URL;
  private loadingSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  // Update the loading status Emit new status using a subject
  private setLoading(isLoading: boolean): void {
    this.loadingSubject.next(isLoading);
  }

  // Get loading status as Observable
  getLoadingStatus(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }

  // Get random image from the API
  getRandomImage(): Observable<Blob> {
    this.setLoading(true);
    const randomDelay = this.getRandomDelay(200, 300);
    return this.http.get(this.apiUrl, { responseType: 'blob' }).pipe(
      delay(randomDelay),
      finalize(() => this.setLoading(false)) // Set loading to false once the request completes
    );
  }

  // Get random delay between min and max
  private getRandomDelay(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
