import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IGallery } from 'src/app/models/gallery.interface';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  //Initialize empty IGallery array, keep track current state of the favorite images
  private favoritesSubject = new BehaviorSubject<IGallery[]>([]);

  // Load favorite from the local storage
  constructor() {
    this.loadFavoritesFromLocalStorage();
  }

  // Get the current list of favorite images as an observable
  getFavorites(): Observable<IGallery[]> {
    const favorites = this.favoritesSubject.asObservable();
    return favorites;
  }

  // Add photo to favorites / save to local storage
  addToFavorites(image: IGallery): void {
    const currentFavorites = this.favoritesSubject.value;
    const updatedFavorites = [...currentFavorites, image];
    this.favoritesSubject.next(updatedFavorites);
    this.saveFavoritesToLocalStorage(updatedFavorites);
  }

  // Delete photo from favorites | update the gallery | save to local storage
  deleteFromFavorites(image: IGallery): void {
    const currentFavorites = this.favoritesSubject.value;
    const updatedFavorites = currentFavorites.filter(
      (fav) => fav.id !== image.id
    );
    this.favoritesSubject.next(updatedFavorites);
    this.saveFavoritesToLocalStorage(updatedFavorites);
  }

  // Save favorites to localStorage
  private saveFavoritesToLocalStorage(favorites: IGallery[]): void {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }

  // Load favorites from localStorage
  private loadFavoritesFromLocalStorage(): void {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      this.favoritesSubject.next(JSON.parse(savedFavorites));
    } else {
      this.favoritesSubject.next([]);
    }
  }
}
