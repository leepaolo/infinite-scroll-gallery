import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import {
  FAVORITES_PHOTOS_ROUTE,
  PHOTO_GALLERY_ROUTE,
} from '../gallery/constants/photo-gallery.constant';
import { FavoritesService } from '../gallery/service/favorites.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  PHOTO_GALLERY_ROUTE = PHOTO_GALLERY_ROUTE;
  FAVORITES_PHOTOS_ROUTE = FAVORITES_PHOTOS_ROUTE;

  galleryTitle = 'Photo Gallery';
  favoriteTitle = 'Favorite Photos';

  galleryGradient = {
    background: '#60a5fa',
    color: '#ffffff',
  };

  favoriteGradient = {
    background: '#f472b6',
    color: '#ffffff',
  };

  activeGalleryStyle = {
    background: '#2563eb',
    color: '#ffffff',
  };

  activeFavoriteStyle = {
    background: '#db2777',
    color: '#ffffff',
  };

  isFavoritesEmpty: boolean = true;
  private menu$: Subscription = new Subscription();

  constructor(private favoritesService: FavoritesService) {}

  ngOnInit(): void {
    this.menu$ = this.favoritesService.getFavorites().subscribe((favorites) => {
      this.isFavoritesEmpty = favorites.length === 0;
    });
  }

  ngOnDestroy() {
    if (this.menu$) {
      this.menu$.unsubscribe();
    }
  }
}
