import { Injectable } from '@angular/core';
import { PictureInterface } from '../interfaces/data.interface';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  addToLocalStorage(pictureArgument: PictureInterface) {
    const favorites: string | null = localStorage.getItem('favorites');

    if (favorites) {
      const fav = JSON.parse(favorites);
      for (let i = 0; i < fav.pictures.length; i++) {
        if (fav.pictures[i].id === pictureArgument.id) {
          fav.pictures.splice(i, 1);
          localStorage.setItem('favorites', JSON.stringify(fav));
          return;
        }
      }
      fav.pictures.push(pictureArgument);
      localStorage.setItem('favorites', JSON.stringify(fav));
    } else {
      localStorage.setItem('favorites', JSON.stringify({ pictures: [] }));
    }
  }
}
