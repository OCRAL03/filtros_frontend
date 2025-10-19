import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticuloModule } from './articulo/articulo.module';
import { TypeOrmModule } from '@nestjs/typeorm'
import { MarcaModule } from './marca/marca.module';
import { CategoriaModule } from './categoria/categoria.module';
import { CondicionProductoModule } from './condicion-producto/condicion-producto.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '', 
      //cambiar la bd luego
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
