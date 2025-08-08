import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseIntPipe, HttpException, HttpStatus, UseInterceptors, UploadedFile, BadRequestException, UploadedFiles } from '@nestjs/common';
import { CreateRecetaDto } from './dto/create-receta.dto';
import { UpdateRecetaDto } from './dto/update-receta.dto';
import { envs, INSUMO_SERVICE, STORAGE_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { diskStorage, memoryStorage } from 'multer';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { catchError, firstValueFrom, map } from 'rxjs';
import { MultipartJsonInterceptor } from 'src/common/interceptors/multipart-json.interceptor';
import { ParseComponentesInterceptor } from 'src/common/interceptors/parse-component-json.interceptor';

@Controller('receta')
export class RecetaController {
  constructor(
    @Inject(INSUMO_SERVICE) private readonly recetaService: ClientProxy,
    @Inject(STORAGE_SERVICE) private readonly storageService: ClientProxy
  ) { }


  @Post()
  @UseInterceptors(FileFieldsInterceptor(
    [{ name: 'imagen', maxCount: 1 }], { storage: memoryStorage() }
  ),
    ParseComponentesInterceptor
  )
  async uploadReceta(
    @UploadedFiles() files: { imagen?: Express.Multer.File[] },
    @Body() createRecetaDto: any
  ) {
    const receta = await firstValueFrom(
      this.recetaService.send<{ id: number }>({ cmd: 'createReceta' }, createRecetaDto)
    );

    // 2️⃣ Si hay archivo, lo subimos al Storage Service
    if (files.imagen?.length) {
      const file = files.imagen[0];
      const upload = await firstValueFrom(
        this.storageService.send(
          { cmd: 'storage.upload' },
          {
            file: {
              buffer: file.buffer.toString('base64'),
              originalname: file.originalname,
              mimetype: file.mimetype,
              size: file.size
            },
            metadata: {
              module: 'receta',
              entityId: receta.id,
              uploadedBy: receta.id,
              description: 'Imagen de receta'
            }
          }
        )
      );

      // ✅ Transforma componentes si viene como string
      await firstValueFrom(
        this.recetaService.send({ cmd: 'updateReceta' }, {
          id: receta.id,
          imagen: upload.url
        } as UpdateRecetaDto)
      );
    }

    return receta;

  }

  @Get('tipo/:tipo')
  findRecetaByTipo(@Param('tipo') tipo: string) {
    return this.recetaService.send({ cmd: 'findRecetaByTipo' }, { tipo });
  }

  @Get()
  async findAll() {
    // 1) Llamas al microservicio y obtienes { data: Receta[] }
    const { data } = await firstValueFrom(
      this.recetaService.send({ cmd: 'findAllReceta' }, {})
    );

    const base = this.getBaseImageUrl();

    // 2) Mapeas cada receta para añadir imagenUrl
    return data.map(r => {
      const path = r.imagen; // aquí almacenas solo el 'path' en la BD
      return {
        ...r,
        imagen: path
          ? `${base}${path}`
          : `${base}/not-image.jpg`
      };
    });
  }

  private getBaseImageUrl() {
    return `http://${envs.storageMicroserviceHost}:${envs.portStorageHttp}`;
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.recetaService.send({ cmd: 'findOneReceta' }, { id });
  }
  @Patch(':id')
  @UseInterceptors(
    // ① Usamos FileInterceptor porque solo hay un campo 'imagen'
    FileInterceptor('imagen', { storage: memoryStorage() }),
    ParseComponentesInterceptor
  )
  async updateReceta(
    @Param('id', ParseIntPipe) id: number,
    // ② @UploadedFile() en singular
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: any
  ) {
    // 1️⃣ Si vino un archivo, súbelo
    if (file) {
      console.log("Actualiza la imagen")
      const upload = await firstValueFrom(
        this.storageService.send(
          { cmd: 'storage.upload' },
          {
            file: {
              buffer: file.buffer.toString('base64'),
              originalname: file.originalname,
              mimetype: file.mimetype,
              size: file.size
            },
            metadata: {
              module: 'receta',
              entityId: id,
              uploadedBy: id,
              description: 'Imagen actualizada'
            }
          }
        )
      );
      // 2️⃣ Asigna el path devuelto (upload.path) al DTO
      dto.imagen = upload.url;
    }

    // 3️⃣ Llamada al microservicio
    const updated = await firstValueFrom(
      this.recetaService.send({ cmd: 'updateReceta' }, { id, ...dto })
    );

    // 4️⃣ Construye la URL para la respuesta
    const base = `http://${envs.storageMicroserviceHost}:${envs.portStorageHttp}/uploads`;
    const path = (updated as any).imagen;
    (updated as any).imagenUrl = path
      ? `${base}/${path}`
      : `${base}/not-image.jpg`;

    return updated;
  }

  /*@Delete(':id')
  remove(@Param('id') id: string) {
    return this.recetaService.remove(+id);
  }
*/

}
