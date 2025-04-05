import { Module } from '@nestjs/common';
import { InsumosModule } from './insumos/insumos.module';
import { PresupuestoModule } from './presupuesto/presupuesto.module';
import { DepositosModule } from './depositos/depositos.module';
import { OrdenFabricacionModule } from './orden-fabricacion/orden-fabricacion.module';
import { MovimientoModule } from './movimiento/movimiento.module';
import { ClienteModule } from './cliente/cliente.module';
import { ProveedorModule } from './proveedor/proveedor.module';
import { ContactoModule } from './contacto/contacto.module';
import { RecetaModule } from './receta/receta.module';
import { ProductoFabricadoModule } from './producto-fabricado/producto-fabricado.module';


@Module({
  imports: [InsumosModule, PresupuestoModule, DepositosModule, ProductoFabricadoModule, OrdenFabricacionModule, MovimientoModule, ClienteModule, ProveedorModule, ContactoModule, RecetaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
