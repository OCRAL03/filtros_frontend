import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticuloModule } from './articulo/articulo.module';
import { TypeOrmModule } from '@nestjs/typeorm'
import { MarcaModule } from './marca/marca.module';
import { CategoriaModule } from './categoria/categoria.module';
import { CondicionProductoModule } from './condicion-producto/condicion-producto.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    // Sirve archivos estáticos del frontend (QuickCart/assets) en /assets
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), '..', 'QuickCart', 'assets'),
      serveRoot: '/assets',
      serveStaticOptions: {
        setHeaders: (res, path) => {
          const lower = (path || '').toLowerCase();
          if (lower.endsWith('.jfif')) {
            res.setHeader('Content-Type', 'image/jpeg');
          } else if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) {
            res.setHeader('Content-Type', 'image/jpeg');
          } else if (lower.endsWith('.png')) {
            res.setHeader('Content-Type', 'image/png');
          } else if (lower.endsWith('.webp')) {
            res.setHeader('Content-Type', 'image/webp');
          } else if (lower.endsWith('.gif')) {
            res.setHeader('Content-Type', 'image/gif');
          } else if (lower.endsWith('.svg')) {
            res.setHeader('Content-Type', 'image/svg+xml');
          }
          // CORS headers para imágenes
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
          // Forzar visualización inline y un caché básico
          res.setHeader('Content-Disposition', 'inline');
          res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
        },
      },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: '', 
      database: 'articulo',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
    }),
    ArticuloModule,
    MarcaModule,
    CategoriaModule,
    CondicionProductoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
