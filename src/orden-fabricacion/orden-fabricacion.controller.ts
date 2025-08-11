import { BadRequestException, Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { envs, INSUMO_SERVICE, STORAGE_SERVICE } from 'src/config';
import { CreateOrdenFabricacionDto } from './dto/create-orden-fabricacion.dto';
import { PaginationDto } from 'src/common';
import { catchError, firstValueFrom } from 'rxjs';
import { UpdateEstadoDto } from './dto/update-estado.dto';
import { UpdateOrdenFabricacionDto } from './dto/update-orden-fabricacion.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { PatchAdjuntoDto } from './dto/patch-adjunto.dto';

@Controller('orden-fabricacion')
export class OrdenFabricacionController {


  constructor(
    @Inject(INSUMO_SERVICE) private readonly insumosClient: ClientProxy,
    @Inject(STORAGE_SERVICE) private readonly storageService: ClientProxy

  ) { }



  @Post()
  createOrdenFrabicacion(@Body() createORdenFabricacionDto: CreateOrdenFabricacionDto) {

    console.log("A crearse la orden")
    return this.insumosClient.send({ cmd: 'createOrdenFabricacion' }, createORdenFabricacionDto);
  }

  @Get()
  findAllOrdenFrabicacion() {
    console.log("devolviendo Ordenes");
    return this.insumosClient.send({ cmd: 'findAllOrdenFabricacion' }, {});
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const of = await firstValueFrom(
      this.insumosClient
        .send({ cmd: 'findOneOrdenFabricacion' }, { id })
        .pipe(catchError(err => { throw new RpcException(err); }))
    );

    // si viene adjunto relativo, lo transformamos a absoluto
    const adj = of?.pedidoCliente?.adjunto ?? null;
    const abs = this.makeAbsolute(adj);

    return {
      ...of,
      pedidoCliente: of?.pedidoCliente
        ? { ...of.pedidoCliente, adjunto: abs }
        : of?.pedidoCliente,
    };
  }

  @Post('oc/upload')
  @UseInterceptors(FileInterceptor('fileOC', { storage: memoryStorage() }))
  async uploadOC(
    @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Archivo requerido');
    const okTypes = ['application/pdf', 'image/png', 'image/jpeg'];
    if (!okTypes.includes(file.mimetype)) throw new BadRequestException('Tipo no permitido');
    if (file.size > 10 * 1024 * 1024) throw new BadRequestException('Máx 10MB');

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
            module: 'pedido-cliente',
            entity: 'orden-fabricacion',
            uploadedBy: 1,
            description: 'Orden de compra adjunta'
          }
        }
      )
    );

    // el storage te debería devolver { url, path, ... }
    return { url: upload.url };
  }

  @Patch(':id/pedido/adjunto')
  setPedidoAdjunto(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: PatchAdjuntoDto
  ) {
    // tu micro debe exponer este cmd (o el nombre que uses)
    return this.insumosClient
      .send({ cmd: 'setPedidoAdjunto' }, { ordenFabricacionId: id, adjunto: body.adjunto })
      .pipe(catchError(err => { throw new RpcException(err); }));
  }

  @Patch(':id')
  updateOrdenFrabicacion(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrdenFabricacion: UpdateOrdenFabricacionDto) {


    console.log(updateOrdenFabricacion);
    return this.insumosClient.send({ cmd: 'updateOrdenFabricacion' }, { id, ...updateOrdenFabricacion })
      .pipe(
        catchError(err => { throw new RpcException(err) })
      )
  }

  private getStorageBaseUrl() {
    return `http://${envs.storageMicroserviceHost}:${envs.portStorageHttp}`;
  }
  private makeAbsolute(urlOrPath?: string | null): string | null {
    if (!urlOrPath) return null;
    // si ya viene absoluta, la devolvemos tal cual
    if (/^https?:\/\//i.test(urlOrPath)) return urlOrPath;
    const base = this.getStorageBaseUrl();
    // evita // duplicados
    return `${base}${urlOrPath.startsWith('/') ? '' : '/'}${urlOrPath}`;
  }

  /*@Delete(':id')
  deleteOrdenFrabicacion(@Param('id', ParseIntPipe) id: number) {
    return this.insumosClient.send({ cmd: 'updateEstadoOrdenFabricacion' }, { id })
      .pipe(
        catchError(err => { throw new RpcException(err) })
      )
  }*/

}
