import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnInit,
} from '@angular/core';
import { IGallery } from '../../../models/gallery.interface';
import { GalleryService } from '../service/gallery.service';
import { FavoritesService } from '../service/favorites.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-photo-gallery',
  templateUrl: './photo-gallery.component.html',
  styleUrls: ['./photo-gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoGalleryComponent implements OnInit {
  gallery: IGallery[] = []; // Initialize an array to store gallery
  isLoading: boolean = false;
  loadingTitle: string = 'Loading images....';
  private galleryList$: Subscription = new Subscription();

  constructor(
    private galleryService: GalleryService,
    private favoritesService: FavoritesService
  ) {}

  // Initialized first, Subscribe to the loading status, update 'isLoading', load 12 images
  ngOnInit(): void {
    this.galleryList$ = this.galleryService
      .getLoadingStatus()
      .subscribe((loading) => {
        this.isLoading = loading;
      });
    this.loadImages(12);
  }

  // INFINITE SCROLL
  @HostListener('window:scroll', [])
  onScroll(): void {
    console.log('Scroll event detected');
    const tolerance = 100; // Tolerance for the scroll event
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - tolerance
    ) {
      console.log('Loading more images');
      this.loadMoreImages();
    }
  }

  // Get ramdom image,
  loadImages(count: number): void {
    for (let i = 0; i < count; i++) {
      this.galleryService.getRandomImage().subscribe((blob: Blob) => {
        const objectURL = URL.createObjectURL(blob); // Convert Blob into a URL for the image
        const image: IGallery = {
          id: this.generateRandomId(),
          photo: objectURL, // Assign the image URL to the 'photo' property
          isFavorite: false,
        };
        this.gallery.push(image);
      });
    }
  }

  // ADD PHOTO TO THE FAVORITES
  addToFavorites(image: IGallery): void {
    if (!image.isFavorite) {
      image.isFavorite = true;
      this.favoritesService.addToFavorites(image);
      console.log('Photo added to favorites', image);
    }
  }

  // LOAD 3 PHOTOS AT THE TIME
  loadMoreImages(): void {
    if (!this.isLoading) {
      this.loadImages(3);
    }
  }
  // Generate a random string ID convert to base-36 and slice the first 9 characters
  generateRandomId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  ngOnDestroy(): void {
    if (this.galleryList$) {
      this.galleryList$.unsubscribe();
    }
  }
}
