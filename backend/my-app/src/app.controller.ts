import { Controller, Get, Res, Delete, Param, NotFoundException, Post } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { AppService } from './app.service';

const favoritesFilePath = 'favorites.json';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Récupérer la liste des photos
  @Get('photos')
  async getPhotos(@Res() res: Response) {
    const photosDirectory = '../../photos';
    const photos = await this.getPhotoPaths(photosDirectory);
    return res.json(photos);
  }

  // Récupérer la liste des photos favorites
  @Get('photos/favorites')
  async getFavoritePhotos(@Res() res: Response) {
    const favorites = this.getFavorites();
    return res.json(favorites);
  }

  // Marquer une photo comme favorite
  @Post('photos/:filename/favorite')
  async markAsFavorite(@Param('filename') filename: string, @Res() res: Response) {
    const photoPath = path.join('../../photos', filename); 
    if (fs.existsSync(photoPath)) {
      const favorites = this.getFavorites();
      favorites.push(filename);
      this.updateFavorites(favorites);
      return res.status(200).send('Photo marquée comme favorite avec succès');
    } else {
      throw new NotFoundException('Photo non trouvée');
    }
  }

  // Supprimer une photo des favorites
  @Delete('photos/:filename/favorite')
  async removeFavorite(@Param('filename') filename: string, @Res() res: Response) {
    const favorites = this.getFavorites();
    const index = favorites.indexOf(filename);
    if (index !== -1) {
      favorites.splice(index, 1);
      this.updateFavorites(favorites);
      return res.status(200).send('Photo retirée des favoris avec succès');
    } else {
      throw new NotFoundException('Photo non trouvée dans les favoris');
    }
  }

  // Supprimer une photo
  @Delete('photos/:filename')
  async deletePhoto(@Param('filename') filename: string, @Res() res: Response) {
    const photoPath = path.join('../../photos', filename);
    if (fs.existsSync(photoPath)) {
      fs.unlinkSync(photoPath); // Supprimer le fichier s'il existe
      const favorites = this.getFavorites();
      const index = favorites.indexOf(filename);
      if (index !== -1) {
        favorites.splice(index, 1);
        this.updateFavorites(favorites);
      }
      return res.status(200).send('Photo supprimée avec succès');
    } else {
      throw new NotFoundException('Photo non trouvée');
    }
  }

  // Récupérer la liste des favoris depuis le fichier JSON
  getFavorites(): string[] {
    if (fs.existsSync(favoritesFilePath)) {
      const favoritesData = fs.readFileSync(favoritesFilePath, 'utf8');
      return JSON.parse(favoritesData);
    } else {
      return [];
    }
  }

  // Mettre à jour la liste des favoris dans le fichier JSON
  updateFavorites(favorites: string[]) {
    const favoritesData = JSON.stringify(favorites);
    fs.writeFileSync(favoritesFilePath, favoritesData);
  }

  // Récupérer les chemins des photos dans un répertoire
  async getPhotoPaths(directory: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      fs.readdir(directory, (err, files) => {
        if (err) {
          reject(err);
        } else {
          const photoPaths = files.map(file => path.join(directory, file));
          resolve(photoPaths);
        }
      });
    });
  }
}
