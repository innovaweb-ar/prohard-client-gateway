import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseIntPipe, UseInterceptors, UploadedFile, UsePipes } from '@nestjs/common';
import { CreateProductoFabricadoDto } from './dto/create-producto-fabricado.dto';
import { UpdateProductoFabricadoDto } from './dto/update-producto-fabricado.dto';
import { INSUMO_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, map } from 'rxjs';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UnwrapSeccionesPipe } from 'src/common/pipes/unwrap-secciones.pipe';
import { TransformSeccionesInterceptor } from 'src/common/middlewares/transform-secciones-interceptor';

@Controller('producto-fabricado')
export class ProductoFabricadoController {
  constructor(
    @Inject(INSUMO_SERVICE) private readonly productoFabricadoClient: ClientProxy
  ) { }

  @Post()
  @UseInterceptors(FileInterceptor('imagen', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtName = extname(file.originalname);
        callback(null, `image-${uniqueSuffix}${fileExtName}`);
      }
    })
  }),
    TransformSeccionesInterceptor
  )

  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createProductoFabricadoDto: CreateProductoFabricadoDto) {

    if (file) {
      createProductoFabricadoDto.imagen = file.filename;
    } else {
      createProductoFabricadoDto.imagen = '';
    }

    console.log(`Enviando al microservicio: ${createProductoFabricadoDto}`);
    return this.productoFabricadoClient.send({ cmd: 'createProductoFabricado' }, createProductoFabricadoDto)
      .pipe(
        catchError(err => { throw new RpcException(err) })
      );
  }


  @Get()
  findAll() {


    return this.productoFabricadoClient.send({ cmd: 'findAllProductoFabricado' }, {})
      .pipe(
        map((productos) => {
          const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

          productos.forEach(producto => {
            if (producto.imagen) {
              producto.imagen = `${baseUrl}/uploads/${producto.imagen}`;
            } else {
              producto.imagen = `${baseUrl}/uploads/not-image.jpg`;
            }
          });
          return productos;
        })
      )
      .pipe(
        catchError(err => { throw new RpcException(err) })
      );
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productoFabricadoClient.send({ cmd: 'findOneProductoFabricado' }, { id })
      .pipe(
        map((producto) => {
          const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

          if (producto && producto.imagen) {
            producto.imagen = `${baseUrl}/uploads/${producto.imagen}`;
          } else {
            producto.imagen = `${baseUrl}/uploads/not-image.jpg`;
          }
          return producto;
        })
      )
      .pipe(
        catchError(err => { throw new RpcException(err) })
      )
  }

  /*
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductoFabricadoDto: UpdateProductoFabricadoDto) {
    return this.productoFabricadoService.update(+id, updateProductoFabricadoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productoFabricadoService.remove(+id);
  }

  */
}
