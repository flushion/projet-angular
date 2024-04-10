import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PhotoModule } from './photo/photo.module';
import { AlbumModule } from './album/album.module';

@Module({
  imports: [PhotoModule, AlbumModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
