import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { IGallery } from 'src/app/models/gallery.interface';
import { FavoritesService } from '../service/favorites.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-favorite-photos',
  templateUrl: './favorite-photos.component.html',
  styleUrls: ['./favorite-photos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritePhotosComponent {
  favoritePhotos: IGallery[] = []; // Initialize an array to store favorite photos
  emptyTitle = 'There are no favorite photos yet';
  ctaTitle = 'Add your first favorite photo';
  private favoriteSub$: Subscription = new Subscription();

  constructor(
    private router: Router,
    private favoritesService: FavoritesService
  ) {}

  // Initialized first, Subscribe to the favorites, load favorite photos
  ngOnInit(): void {
    this.favoriteSub$ = this.favoritesService
      .getFavorites()
      .subscribe((favorites) => {
        this.favoritePhotos = favorites;
      });
  }

  // Navigate to single photo view
  openPhoto(photo: IGallery): void {
    this.router.navigate(['/photos', photo.id]);
  }

  navigateToGallery(): void {
    this.router.navigate(['/photo-gallery']);
  }

  // Add the trackBy function to improve performance with *ngFor
  trackByPhotoId(index: number, photo: IGallery): string {
    return photo.id; // Assuming 'id' is a unique identifier for each photo in IGallery
  }

  ngOnDestroy() {
    if (this.favoriteSub$) {
      this.favoriteSub$.unsubscribe();
    }
  }
}
