import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { CreateContactoDto } from './dto/create-contacto.dto';
import { UpdateContactoDto } from './dto/update-contacto.dto';
import { INSUMO_SERVICE } from 'src/config';
import { ClientProxy } from '@nestjs/microservices';

@Controller('contacto')
export class ContactoController {

  constructor(
    @Inject(INSUMO_SERVICE) private readonly contactoClient: ClientProxy
  ) {}

  @Post()
  createContacto(@Body() createContactoDto: CreateContactoDto) {
    return this.contactoClient.send({cmd: 'createContacto'}, createContactoDto);
  }

  @Get()
  findAllContacto() {
    console.log('findAllContacto');
    return this.contactoClient.send({cmd: 'findAllContacto'}, {});
  }

  /*
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactoClient.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContactoDto: UpdateContactoDto) {
    return this.contactoClient.update(+id, updateContactoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactoClient.remove(+id);
  }
    */
}
