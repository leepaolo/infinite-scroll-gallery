import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IGallery } from 'src/app/models/gallery.interface';
import { FavoritesService } from '../service/favorites.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-single-photo',
  templateUrl: './single-photo.component.html',
  styleUrls: ['./single-photo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SinglePhotoComponent implements OnInit {
  // Hold the selected photo or undefined initially
  photo: IGallery | undefined;
  removeFavoriteTitle = 'Remove from favorites';

  // Define default styles
  galleryGradient = {
    background: '#60a5fa',
    color: '#ffffff',
  };

  activeGalleryStyle = {
    background: '#2563eb',
    color: '#ffffff',
  };

  isFavoritesEmpty: boolean = false;
  private singlePhoto$: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private favoritesService: FavoritesService
  ) {}

  // Get the photo id from the route and fetch the photo from the favorites
  ngOnInit(): void {
    const photoId = this.route.snapshot.paramMap.get('id');
    if (photoId) {
      this.singlePhoto$ = this.favoritesService
        .getFavorites()
        .subscribe((favorites) => {
          this.photo = favorites.find((fav) => fav.id === photoId);
        });
    }
  }
  // Remove the current photo from favorites
  removeFromFavorites(): void {
    if (this.photo) {
      this.favoritesService.deleteFromFavorites(this.photo);
      this.favoritesService.getFavorites().subscribe((favorites) => {
        if (favorites.length === 0) {
          this.router.navigate(['/photo-gallery']);
        } else {
          this.router.navigate(['/favorites']);
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.singlePhoto$) {
      this.singlePhoto$.unsubscribe();
    }
  }
}
