import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseIntPipe, HttpException, HttpStatus, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CreateRecetaDto } from './dto/create-receta.dto';
import { UpdateRecetaDto } from './dto/update-receta.dto';
import { INSUMO_SERVICE } from 'src/config';
import { ClientProxy } from '@nestjs/microservices';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';

@Controller('receta')
export class RecetaController {
  constructor(
    @Inject(INSUMO_SERVICE) private readonly recetaService: ClientProxy
  ) { }


  @Post()
  @UseInterceptors(FileInterceptor('imagenFile', {
    storage: diskStorage({
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtName = extname(file.originalname);
        callback(null, `image-${uniqueSuffix}${fileExtName}`)
      }
    })
  }))
  async uploadReceta(
    @UploadedFile() file: Express.Multer.File,
    @Body() createRecetaDto: any
  ) {
    // Si se sube una imagen, asigna su nombre (o path) a imagenUrl.
    if (file) {
      createRecetaDto.imagenUrl = file.filename; // O file.path según prefieras.
    } else {
      createRecetaDto.imagenUrl = '';
    }

    return this.recetaService.send({ cmd: 'createReceta' }, createRecetaDto);
  }

  @Get('tipo/:tipo')
  findRecetaByTipo(@Param('tipo') tipo: string) {
    return this.recetaService.send({ cmd: 'findRecetaByTipo' }, { tipo });
  }

  @Get()
  findAll() {
    return this.recetaService.send({ cmd: 'findAllReceta' }, {});
  }

  
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.recetaService.send({cmd: 'findOneReceta'},{id});
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateRecetaDto: UpdateRecetaDto) {
    try {
      console.log('Datos enviados al microservicio:', updateRecetaDto);
      const response = await this.recetaService.send({ cmd: 'updateReceta' }, { id, ...updateRecetaDto }).toPromise();
      return response;
    } catch (error) {
      console.error('Error al enviar la receta al microservicio:', error?.response?.data || error.message);
      throw new HttpException(error?.response?.data || 'Error en la validación de la receta', HttpStatus.BAD_REQUEST);
    }
  }
  /*
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.recetaService.remove(+id);
    }
  
    */
}
