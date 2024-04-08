import { Controller, Get, Res, Delete, Param, NotFoundException, Post, Body } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as Jimp from 'jimp'; // pour la taille d'image

const photosDirectory = 'photos';
const photosFilePath = 'photos.json'; // Chemin vers le fichier JSON contenant les données des photos
const cheminFichierAlbums = 'albums.json'; // Chemin du fichier JSON contenant les données des albums

@Controller()
export class AppController {
  constructor() { }

  // Récupérer la liste des photos sans affecter les données des photos existantes
  @Get('photos')
  async getPhotos(@Res() res: Response) {
    // Récupérer les chemins des nouvelles photos depuis le dossier
    const photoPaths = await this.getNewPhotoPaths(photosDirectory);
    // Créer les données des nouvelles photos à partir des chemins
    const newPhotosData = await this.createPhotosData(photoPaths);
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
  @Post('photos/:name/favorite')
  async markAsFavorite(@Param('name') photoName: string, @Res() res: Response) {
    const photos = this.getPhotosData();
    const photoIndex = photos.findIndex(photo => photo.name === photoName); // Recherche de l'index de la photo dans le tableau de données des photos
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
  @Delete('photos/:name/favorite')
  async removeFavorite(@Param('name') photoName: string, @Res() res: Response) {
    const photos = this.getPhotosData();
    const photo = photos.find(photo => photo.name === photoName); // Inclure le répertoire 'photos' dans le chemin
    if (photo) {
      photo.liked = false;
      this.updatePhotosData(photos);
      return res.status(200).send('Photo retirée des favoris avec succès');
    } else {
      throw new NotFoundException('Photo non trouvée dans les favoris');
    }
  }

  // Supprimer une photo (marquer comme supprimée)
  @Delete('photos/:name')
  async deletePhoto(@Param('name') photoName: string, @Res() res: Response) {
    try {
      const filePath = path.join(photosDirectory, photoName);
      fs.unlinkSync(filePath); // Supprimer le fichier de la photo

      // Mettre à jour les données des photos dans le fichier JSON
      const existingPhotos = this.getPhotosData();
      const updatedPhotos = existingPhotos.filter(photo => photo.name !== photoName);
      this.updatePhotosData(updatedPhotos);

      return res.status(200).send('Photo supprimée avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression de la photo : ', error);
      throw new NotFoundException('Erreur lors de la suppression de la photo');
    }
  }

  // Obtenir une photo spécifique par son nom
  @Get('photos/:name')
  async getPhotoByName(@Param('name') photoName: string, @Res() res: Response) {
    try {
      // Vérifier si le fichier existe dans le répertoire des photos
      const filePath = path.join(photosDirectory, photoName);
      if (!fs.existsSync(filePath)) {
        throw new NotFoundException('Photo non trouvée');
      }

      // Lire le fichier de la photo et renvoyer son contenu en réponse
      const fileContent = fs.readFileSync(filePath);
      res.setHeader('Content-Type', 'image/jpeg'); // Définir le type de contenu en fonction du type de fichier
      return res.send(fileContent);
    } catch (error) {
      console.error('Erreur lors de la récupération de la photo : ', error);
      throw new NotFoundException('Erreur lors de la récupération de la photo');
    }
  }

  // Obtenir les informations d'une photo par son nom
  @Get('photos/:name/info')
  async getPhotoInfoByName(@Param('name') photoName: string) {
    try {
      const photosData = this.getPhotosData();
      const photo = photosData.find((photo: { name: string }) => photo.name === photoName);
      if (!photo) {
        throw new NotFoundException('Photo non trouvée');
      }
      return {
        name: photo.name,
        createdAt: photo.createdAt,
        liked: photo.liked,
        size: photo.size,
        dimensions: photo.dimensions
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des informations sur l\'image : ', error);
      throw new NotFoundException('Erreur lors de la récupération des informations sur l\'image');
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
    const photosData = JSON.stringify(photos, null, 2);
    fs.writeFileSync(photosFilePath, photosData);
  }

  // Récupérer les chemins des photos dans un répertoire avec les données de création
  async getNewPhotoPaths(directory: string): Promise<{ name: string, createdAt: Date }[]> {
    const existingPhotos = this.getPhotosData();
    const existingPhotoNames = existingPhotos.map(photo => photo.name);
    return new Promise((resolve, reject) => {
      fs.readdir(directory, async (err, files) => {
        if (err) {
          reject(err);
        } else {
          const newPhotoPathsPromises = files.map(async (file) => {
            const filePath = path.join(directory, file);
            const stats = await fs.promises.stat(filePath);
            const photoName = file;
            // Vérifier si le nom de la photo est nouveau
            if (!existingPhotoNames.includes(photoName)) {
              return { name: photoName, createdAt: stats.birthtime };
            }
          });
          const newPhotoPaths = await Promise.all(newPhotoPathsPromises);
          // Filtrer les noms de photos pour ne récupérer que les nouveaux
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
    const existingPhotoNames = existingPhotos.map(photo => photo.name);
    const newPhotos = existingPhotos.filter(photo => !existingPhotoNames.includes(photo.name));
    return newPhotos;
  }

  // Récupérer la taille de l'image à partir du chemin du fichier
  async getImageSize(filePath: string): Promise<number> {
    try {
      const stats = await fs.promises.stat(filePath);
      return stats.size;
    } catch (error) {
      console.error('Erreur lors de la récupération de la taille de l\'image : ', error);
      return -1;
    }
  }

  // Récupérer les dimensions de l'image à partir du chemin du fichier
  async getImageDimensions(filePath: string): Promise<{ width: number, height: number }> {
    try {
      const image = await Jimp.read(filePath);
      return {
        width: image.bitmap.width,
        height: image.bitmap.height
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des dimensions de l\'image : ', error);
      return { width: -1, height: -1 };
    }
  }

  // Créer les données des photos à partir des chemins
  async createPhotosData(photoPaths: { name: string, createdAt: Date }[]): Promise<any[]> {
    const albums = this.getAlbumsData();
    const promises = photoPaths.map(async (photoPath) => {
      const dimensions = await this.getImageDimensions(path.join(photosDirectory, photoPath.name));
      const size = await this.getImageSize(path.join(photosDirectory, photoPath.name));
      const photoAlbums = albums.filter(album => album.photos.includes(photoPath.name)).map(album => album.nom);
      return {
        name: photoPath.name,
        createdAt: photoPath.createdAt,
        liked: false,
        size: size,
        dimensions: dimensions,
        albums: photoAlbums
      };
    });
    return Promise.all(promises);
  }




  // Obtenir les données des albums
  getAlbumsData(): any[] {
    try {
      if (fs.existsSync(cheminFichierAlbums)) {
        const donneesAlbums = fs.readFileSync(cheminFichierAlbums, 'utf8');
        if (donneesAlbums.trim() !== '') {
          return JSON.parse(donneesAlbums);
        } else {
          return [];
        }
      } else {
        return [];
      }
    } catch (error) {
      console.error('Erreur lors de la lecture des données des albums :', error);
      return [];
    }
  }

  // Mettre à jour les données des albums dans le fichier JSON
  updateAlbumsData(albums: any[]) {
    const donneesAlbums = JSON.stringify(albums, null, 2);
    fs.writeFileSync(cheminFichierAlbums, donneesAlbums);
  }

  @Get('albums')
  async getAllAlbums(@Res() res: Response) {
    try {
      const albums = this.getAlbumsData();
      return res.json(albums);
    } catch (error) {
      console.error('Erreur lors de la récupération de tous les albums :', error);
      throw new NotFoundException('Erreur lors de la récupération de tous les albums');
    }
  }

  // Obtenir les informations d'un album par son nom
  @Get('albums/:nom')
  async getInfoAlbumParNom(@Param('nom') nomAlbum: string, @Res() res: Response) {
    try {
      const donneesAlbums = this.getAlbumsData();
      const album = donneesAlbums.find((album: { nom: string }) => album.nom === nomAlbum);
      if (!album) {
        throw new NotFoundException('Album introuvable');
      }
      return res.json(album);
    } catch (error) {
      console.error('Erreur lors de la récupération des informations sur l\'album :', error);
      throw new NotFoundException('Erreur lors de la récupération des informations sur l\'album');
    }
  }

  // Créer un nouvel album
  @Post('albums/:nomAlbum')
  async creerAlbum(@Param('nomAlbum') nomAlbum: string, @Res() res: Response) {
    try {
      const albums = this.getAlbumsData();
      if (!albums.some(album => album.nom === nomAlbum)) {
        albums.push({ nom: nomAlbum, photos: [] });
        this.updateAlbumsData(albums);
        return res.status(201).send('Album créé avec succès');
      } else {
        return res.status(400).send('Un album avec ce nom existe déjà');
      }
    } catch (error) {
      console.error('Erreur lors de la création de l\'album :', error);
      throw new NotFoundException('Erreur lors de la création de l\'album');
    }
  }


  // Supprimer un album
  @Delete('albums/:nom')
  async supprimerAlbum(@Param('nom') nomAlbum: string, @Res() res: Response) {
    try {
      const albums = this.getAlbumsData();
      const index = albums.findIndex(album => album.nom === nomAlbum);
      if (index !== -1) {
        albums.splice(index, 1);
        this.updateAlbumsData(albums);
        return res.status(200).send('Album supprimé avec succès');
      } else {
        throw new NotFoundException('Album introuvable');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'album :', error);
      throw new NotFoundException('Erreur lors de la suppression de l\'album');
    }
  }

  // Ajouter une photo à un album
  @Post('albums/:nomAlbum/photos/:nomPhoto')
  async ajouterAuAlbum(@Param('nomAlbum') nomAlbum: string, @Param('nomPhoto') nomPhoto: string, @Res() res: Response) {
    try {
      const albums = this.getAlbumsData();
      const indexAlbum = albums.findIndex(album => album.nom === nomAlbum);
      if (indexAlbum !== -1) {
        const photos = this.getPhotosData();
        const indexPhoto = photos.findIndex(photo => photo.name === nomPhoto);
        if (indexPhoto !== -1) {
          if (!albums[indexAlbum].photos.includes(nomPhoto)) {
            albums[indexAlbum].photos.push(nomPhoto);

            photos[indexPhoto].albums.push(nomAlbum);
            this.updatePhotosData(photos);

            this.updateAlbumsData(albums);
            return res.status(200).send('Photo ajoutée à l\'album avec succès');
          } else {
            return res.status(400).send('Cette photo est déjà présente dans l\'album');
          }
        } else {
          throw new NotFoundException('Photo introuvable');
        }
      } else {
        throw new NotFoundException('Album introuvable');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la photo à l\'album :', error);
      throw new NotFoundException('Erreur lors de l\'ajout de la photo à l\'album');
    }
  }


  // Supprimer une photo d'un album
  @Delete('albums/:nomAlbum/photos/:nomPhoto')
  async supprimerDeAlbum(@Param('nomAlbum') nomAlbum: string, @Param('nomPhoto') nomPhoto: string, @Res() res: Response) {
    try {
      const albums = this.getAlbumsData();
      const indexAlbum = albums.findIndex(album => album.nom === nomAlbum);
      if (indexAlbum !== -1) {
        const indexPhoto = albums[indexAlbum].photos.findIndex((photo: string) => photo === nomPhoto);
        if (indexPhoto !== -1) {
          albums[indexAlbum].photos.splice(indexPhoto, 1);
          this.updateAlbumsData(albums);
          return res.status(200).send('Photo supprimée de l\'album avec succès');
        } else {
          return res.status(400).send('Cette photo n\'est pas présente dans l\'album');
        }
      } else {
        throw new NotFoundException('Album introuvable');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la photo de l\'album :', error);
      throw new NotFoundException('Erreur lors de la suppression de la photo de l\'album');
    }
  }
}
