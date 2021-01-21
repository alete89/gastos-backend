import { formatearFecha } from '../lib/helpers'
import { Gasto } from '../model/gasto'

export const gastosDeUnAnio = async (id_tarjeta: string, anio: number, relations: string[] = []) => {
  const desde = new Date(anio, 0, 1)
  const hasta = new Date(anio, 11, 31)
  return await getGastos(id_tarjeta, desde, hasta, relations)
}

export const gastosDeUnMesYAnio = async (id_tarjeta: string, mes: number, anio: number, relations: string[] = []) => {
  const fecha = new Date(anio, mes, 1)
  return await getGastos(id_tarjeta, fecha, fecha, relations)
}

const getGastos = async (id_tarjeta: string, desde: Date, hasta: Date, relations: string[] = []) => {
  const gastos = await Gasto.find({
    relations,
    where: `fecha_primer_resumen <= '${formatearFecha(hasta)}' 
            AND fecha_primer_resumen + INTERVAL '1 month' * (cuotas - 1) >= '${formatearFecha(desde)}'
            AND "tarjetaId" = ${id_tarjeta}`,
  })
  return gastos
}
