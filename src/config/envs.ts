import { Logger } from '@nestjs/common';
import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
    PORT: number;
    INSUMOS_MICROSERVICES_HOST: string;
    INSUMOS_MICROSERVICES_PORT: number;
    PRESUPUESTO_MICROSERVICES_HOST: string;
    PRESUPUESTO_MICROSERVICES_PORT: number;
}

const envsSchema = joi.object({
    PORT: joi.number().required(),
    INSUMOS_MICROSERVICES_HOST: joi.string().required(),
    INSUMOS_MICROSERVICES_PORT: joi.number().required()
})
    .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const EnvVars: EnvVars = value;


export const envs = {
    port: EnvVars.PORT,
    insumosMicroserviceHost: EnvVars.INSUMOS_MICROSERVICES_HOST,
    insumoMicroservicePort: EnvVars.INSUMOS_MICROSERVICES_PORT,
    presupustoMicroserviceHost: EnvVars.PRESUPUESTO_MICROSERVICES_HOST,
    presupuestoMicroservicePort: EnvVars.PRESUPUESTO_MICROSERVICES_PORT
}