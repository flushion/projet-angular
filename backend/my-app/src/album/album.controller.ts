import { Controller, Get, Res, Delete, Param, NotFoundException, Post, Body } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';

const cheminFichierAlbums = 'albums.json'; // Chemin du fichier JSON contenant les données des albums
const photosFilePath = 'photos.json'; // Chemin vers le fichier JSON contenant les données des photos

@Controller()
export class AlbumController {
    constructor() { }


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

    // Obtenir les informations d'un album par son nom
    @Get('albums/:nom')
    async getInfoAlbumParNom(@Param('nom') nomAlbum: string, @Res() res: Response) {
        try {
            const albums = this.getAlbumsData();
            const album = albums.find((album: { nom: string }) => album.nom === nomAlbum);
            if (!album) {
                throw new NotFoundException('Album introuvable');
            }

            // Récupérer les données de toutes les photos
            const photos = this.getPhotosData();

            // Filtrer les photos appartenant à cet album
            const photosDeCetAlbum = photos.filter(photo => album.photos.includes(photo.name));

            // Retourner les informations complètes de chaque photo
            const infosPhotos = photosDeCetAlbum.map(photo => {
                return {
                    name: photo.name,
                    createdAt: photo.createdAt,
                    liked: photo.liked,
                    size: photo.size,
                    dimensions: photo.dimensions
                };
            });

            return res.json(infosPhotos);
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
