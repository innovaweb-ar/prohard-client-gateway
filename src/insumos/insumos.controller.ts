import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { INSUMO_SERVICE } from 'src/config';
import { CreateInsumoDto } from './dto/create-insumo.dto';
import { catchError, map } from 'rxjs';
import { UpdateInsumoDto } from './dto/update-insumo.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path'
import { AuthGuard } from 'src/auth/guards/auth.guard';


@Controller('insumos')
export class InsumosController {

  constructor(
    @Inject(INSUMO_SERVICE) private readonly insumosClient: ClientProxy
  ) { }


  /*@Post()
  createInsumo(@Body() crateInsumoDto: CreateInsumoDto) {

    return this.insumosClient.send({ cmd: 'create_insumo' }, crateInsumoDto);
  }*/


  @Post()
  @UseInterceptors(FileInterceptor('imageFile', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtName = extname(file.originalname);
        callback(null, `image-${uniqueSuffix}${fileExtName}`)
      }
    })
  }))
  async uploadInsumo(
    @UploadedFile() file: Express.Multer.File,
    @Body() createInsumoDto: any
  ) {

    // Si se sube una imagen, asigna su nombre (o path) a imagenUrl.
    if (file) {
      createInsumoDto.imagenUrl = file.filename; // O file.path según prefieras.
    } else {
      createInsumoDto.imagenUrl = '';
    }

    // Asegurarse que los campos numéricos y booleanos se conviertan correctamente:
    createInsumoDto.minimunStock = Number(createInsumoDto.minimunStock);
    createInsumoDto.available = createInsumoDto.available === 'true';
    createInsumoDto.isInventoriable = createInsumoDto.isInventoriable === 'true';

    // Si el campo proveedores se envía como string, parsearlo a array
    if (typeof createInsumoDto.proveedores === 'string') {
      try {
        createInsumoDto.proveedores = JSON.parse(createInsumoDto.proveedores);
      } catch (error) {
        createInsumoDto.proveedores = [];
      }
    }

    return this.insumosClient.send({ cmd: 'create_insumo' }, createInsumoDto);
  }

  //@UseGuards(AuthGuard)
  @Get()
  findAllInsumos(@Query() paginationDto: PaginationDto) {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    return this.insumosClient.send({ cmd: 'find_all_insumos' }, paginationDto)
      .pipe(
        map(response => {
          // Suponiendo que el microservicio devuelve:
          // { data: Insumo[], meta: { ... } }
          if (response && Array.isArray(response.data)) {
            response.data = response.data.map(insumo => {
              if (insumo.imagenUrl) {
                insumo.imagenUrl = `${baseUrl}/uploads/${insumo.imagenUrl}`;
              }
              else {
                insumo.imagenUrl = `${baseUrl}/uploads/not-image.jpg`;
              }
              return insumo;
            });
          }
          return response;
        }),
        catchError(err => { throw new RpcException(err); })
      );
  }

  @Get('notfilters')
  findAllNotFilters(){
    return this.insumosClient.send({ cmd: 'find_all_insumos_not_filters' },{})
  }


  @Get(':id')
  async findOneInsumo(@Param('id', ParseIntPipe) id: number) {

    return this.insumosClient.send({ cmd: 'find_one_insumo' }, { id })
      .pipe(
        map((insumo) => {
          const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
          //Si la imagen existe, se agrega el prefijo completo
          if (insumo && insumo.imagenUrl) {
            insumo.imagenUrl = `${baseUrl}/uploads/${insumo.imagenUrl}`;
          }
          else {
            insumo.imagenUrl = `${baseUrl}/uploads/not-image.jpg`;
          }

          return insumo;
        }),
        catchError(err => { throw new RpcException(err) })
      )

  }


  @Patch(':id')
  @UseInterceptors(FileInterceptor('imageFile', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const fileExtName = extname(file.originalname);
        callback(null, `image-${uniqueSuffix}${fileExtName}`);
      }
    })
  }))
  updateInsumo(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateInsumoDto: any
  ) {
    // Solo se actualiza la imagen si se sube un nuevo archivo
    if (file) {
      updateInsumoDto.imagenUrl = file.filename;
    }
    
    // Conversión de tipos:
    updateInsumoDto.minimunStock = Number(updateInsumoDto.minimunStock);
    updateInsumoDto.available = updateInsumoDto.available === 'true';
    updateInsumoDto.isInventoriable = updateInsumoDto.isInventoriable === 'true';
  
    // Parsear proveedores si viene como string
    if (typeof updateInsumoDto.proveedores === 'string') {
      try {
        updateInsumoDto.proveedores = JSON.parse(updateInsumoDto.proveedores);
      } catch (error) {
        updateInsumoDto.proveedores = [];
      }
    }
  
    return this.insumosClient.send({ cmd: 'update_insumo' }, { id, ...updateInsumoDto })
      .pipe(
        catchError(err => { throw new RpcException(err) })
      );
  }
  

  @Delete(':id')
  deleteInsumo(@Param('id', ParseIntPipe) id: number) {
    return this.insumosClient.send({ cmd: 'delete_insumo' }, { id })
      .pipe(
        catchError(err => { throw new RpcException(err) })
      )
  }

}
