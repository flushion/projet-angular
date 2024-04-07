import { Controller, Get, Res, Delete, Param, NotFoundException, Post } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

const photosDirectory = 'photos';
const photosFilePath = 'photos.json'; // Chemin vers le fichier JSON contenant les données des photos

@Controller()
export class AppController {
  constructor() { }

  // Récupérer la liste des photos sans affecter les données des photos existantes
  @Get('photos')
  async getPhotos(@Res() res: Response) {
    // Récupérer les chemins des nouvelles photos depuis le dossier
    const photoPaths = await this.getNewPhotoPaths(photosDirectory);
    // Créer les données des nouvelles photos à partir des chemins
    const newPhotosData = this.createPhotosData(photoPaths);
    // Mettre à jour le fichier photos.json avec les données des nouvelles photos
    this.updateNewPhotosData(newPhotosData);
    // Récupérer les données complètes des photos, y compris les anciennes et les nouvelles
    const allPhotosData = this.getAllPhotosData();
    // Renvoyer les données des photos
    return res.json(allPhotosData);
  }

  // Récupérer la liste des photos favorites
  @Get('photos/favorites')
  async getFavoritePhotos(@Res() res: Response) {
    const photos = this.getPhotosData().filter(photo => photo.liked);
    return res.json(photos);
  }

  // Marquer une photo comme favorite
  @Post('photos/:path/favorite')
  async markAsFavorite(@Param('path') photoPath: string, @Res() res: Response) {
    const photos = this.getPhotosData();
    const photoIndex = photos.findIndex(photo => photo.path === `photos/${photoPath}`); // Recherche de l'index de la photo dans le tableau de données des photos
    if (photoIndex !== -1) {
      // Marquer la photo comme favorite
      photos[photoIndex].liked = true;
      // Mettre à jour les données des photos dans le fichier JSON
      this.updatePhotosData(photos);
      return res.status(200).send('Photo marquée comme favorite avec succès');
    } else {
      throw new NotFoundException('Photo non trouvée');
    }
  }


  // Supprimer une photo des favorites
  @Delete('photos/:path/favorite')
  async removeFavorite(@Param('path') photoPath: string, @Res() res: Response) {
    const photos = this.getPhotosData();
    const photo = photos.find(photo => photo.path === `photos/${photoPath}`); // Inclure le répertoire 'photos' dans le chemin
    if (photo) {
      photo.liked = false;
      this.updatePhotosData(photos);
      return res.status(200).send('Photo retirée des favoris avec succès');
    } else {
      throw new NotFoundException('Photo non trouvée dans les favoris');
    }
  }

  // Supprimer une photo (marquer comme supprimée)
  @Delete('photos/:path')
  async deletePhoto(@Param('path') photoPath: string, @Res() res: Response) {
    try {
      const filePath = path.join(photosDirectory, photoPath);
      fs.unlinkSync(filePath); // Supprimer le fichier de la photo

      // Mettre à jour les données des photos dans le fichier JSON
      const existingPhotos = this.getPhotosData();
      const updatedPhotos = existingPhotos.filter(photo => photo.path !== `photos/${photoPath}`);
      this.updatePhotosData(updatedPhotos);

      return res.status(200).send('Photo supprimée avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression de la photo : ', error);
      throw new NotFoundException('Erreur lors de la suppression de la photo');
    }
  }


  // Récupérer les données des photos depuis le fichier JSON
  getPhotosData(): any[] {
    try {
      if (fs.existsSync(photosFilePath)) {
        const photosData = fs.readFileSync(photosFilePath, 'utf8');
        if (photosData.trim() !== '') {
          return JSON.parse(photosData);
        } else {
          return [];
        }
      } else {
        return [];
      }
    } catch (error) {
      console.error('erreur lors de l’analyse des données de photos:', error);
      return [];
    }
  }


  // Mettre à jour les données des photos dans le fichier JSON en conservant l'état des photos existantes
  updatePhotosData(photos: any[]) {
    const photosData = JSON.stringify(photos, null, 2); // Indentation pour une meilleure lisibilité
    fs.writeFileSync(photosFilePath, photosData);
  }

  // Récupérer les chemins des photos dans un répertoire avec les données de création
  async getNewPhotoPaths(directory: string): Promise<{ path: string, createdAt: Date }[]> {
    const existingPhotos = this.getPhotosData();
    const existingPhotoPaths = existingPhotos.map(photo => photo.path);
    return new Promise((resolve, reject) => {
      fs.readdir(directory, async (err, files) => {
        if (err) {
          reject(err);
        } else {
          const newPhotoPathsPromises = files.map(async (file) => {
            const filePath = path.join(directory, file);
            const stats = await fs.promises.stat(filePath);
            const photoPath = `photos/${file}`;
            // Vérifier si le chemin de la photo est nouveau
            if (!existingPhotoPaths.includes(photoPath)) {
              return { path: photoPath, createdAt: stats.birthtime };
            }
          });
          const newPhotoPaths = await Promise.all(newPhotoPathsPromises);
          // Filtrer les chemins de photos pour ne récupérer que les nouveaux
          const filteredNewPhotoPaths = newPhotoPaths.filter(photoPath => photoPath !== undefined);
          resolve(filteredNewPhotoPaths);
        }
      });
    });
  }

  // Mettre à jour les données des nouvelles photos dans le fichier JSON
  updateNewPhotosData(newPhotos: any[]) {
    if (newPhotos.length > 0) {
      const existingPhotos = this.getPhotosData();
      const updatedPhotos = [...existingPhotos, ...newPhotos];
      this.updatePhotosData(updatedPhotos);
    }
  }

  // Créer les données des photos à partir des chemins
  createPhotosData(photoPaths: { path: string, createdAt: Date }[]): any[] {
    return photoPaths.map((photoPath) => ({
      path: photoPath.path,
      createdAt: photoPath.createdAt,
      liked: false,
    }));
  }

  // Récupérer les données complètes des photos depuis le fichier JSON
  getAllPhotosData(): any[] {
    const existingPhotos = this.getPhotosData();
    const newPhotos = this.getNewPhotosData();
    // Fusionner les données des photos existantes avec les nouvelles photos
    const allPhotos = [...existingPhotos, ...newPhotos];
    return allPhotos;
  }

  // Récupérer les données des nouvelles photos depuis le fichier JSON
  getNewPhotosData(): any[] {
    const existingPhotos = this.getPhotosData();
    const existingPhotoPaths = existingPhotos.map(photo => photo.path);
    const newPhotos = existingPhotos.filter(photo => !existingPhotoPaths.includes(photo.path));
    return newPhotos;
  }
}
