import { Body, Controller, Get, Inject, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { firstValueFrom } from 'rxjs';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { User } from 'src/auth/decorators';
import { CurrenteUser } from 'src/auth/interfaces/current-user.interface';

@Controller('permission')
export class PermissionController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) { }


  @Post()
  createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    return this.authClient.send('createPermission', createPermissionDto);
  }

  @Get()
  getPermissions() {
    return this.authClient.send('findAllPermission', {});
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getMyPermissions(@User() user: CurrenteUser) {
    const normalize = (r: string) => (r?.startsWith('/') ? r : `/${r}`);
    const toRoutes = (val: any): string[] => {
      if (!val) return [];
      if (Array.isArray(val)) {
        // array de strings o de objetos {route|name}
        return val
          .map((p: any) => typeof p === 'string' ? p : (p?.route ?? p?.name ?? ''))
          .filter(Boolean)
          .map(normalize);
      }
      // objeto { routes?, permissions? }
      if (Array.isArray(val.routes)) return val.routes.map(normalize);
      if (Array.isArray(val.permissions)) {
        // si vinieran solo permisos (no rutas), devolvé vacío o mapeá si tus permisos fueran rutas
        return [];
      }
      return [];
    };

    // 1) Si el token ya trae scopes (y son rutas), úsalo
    if (user?.scopes?.length) {
      const routes = user.scopes
        .map((s) => (typeof s === 'string' ? s : ''))
        .filter(Boolean)
        .map(normalize);
      return { data: Array.from(new Set(routes)) };
    }

    // 2) Si no hay scopes en el token, consultá al micro
    try {
      const perms = await firstValueFrom(
        this.authClient.send('getPermissionByUser', { userId: user.id })
      );
      const routes = toRoutes(perms);
      return { data: Array.from(new Set(routes)) };
    } catch (e) {
      // opcional: loguear el error y devolver 502/500
      throw new RpcException({ status: 502, message: 'No se pudieron obtener permisos' } as any);
    }
  }

  @Get(':roleId')
  getPermisoByRole(@Param('roleId', ParseIntPipe) roleId: number) {
    return this.authClient.send('getPermissionByRole', roleId);
  }

}