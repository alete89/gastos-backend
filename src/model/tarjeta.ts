import { BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, Entity } from 'typeorm'
import { Gasto } from './gasto'

@Entity()
export class Tarjeta extends BaseEntity {
  constructor(init?: Partial<Tarjeta>) {
    super()
    Object.assign(this, init)
  }

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  nombre: string

  @OneToMany(type => Gasto, gasto => gasto.tarjeta, {
    cascade: true,
  })
  gastos: Gasto[]

  @Column({ nullable: true })
  dia_regla_cierre_resumen: number // día dentro de la semana 1-7 (LUNES -> 1)

  @Column({ nullable: true })
  semana_regla_cierre_resumen: number // semana dentro de un mes 1-4

  @Column({ nullable: true })
  dia_regla_vencimiento: number // día dentro de la semana 1-7 (LUNES -> 1)

  @Column({ nullable: true })
  semana_regla_vencimiento: number // semana dentro de un mes 1-4

  calcularfechaDeCierre(anio: number, mes: number) {
    let fecha = new Date(anio, mes, 1, 23, 59, 59)
    fecha.setDate(
      1 +
        7 * (this.semana_regla_cierre_resumen - 1) +
        this.ajusteDia(this.getDayFrom0To6(this.dia_regla_cierre_resumen) - fecha.getDay())
    )
    if (fecha.getMonth() > mes) fecha.setDate(fecha.getDate() - 7) //EN EL CASO DE QUE LA REGLA SEA LA 5TA SEMANA Y ESE DIA TIENE SOLO 4 EN ESE MES, LE RESTA 7 DIAS PARA DEVOLVER EL 4TO.
    return fecha
  }

  ajusteDia(diferencia: number) {
    if (diferencia < 0) return 7 + diferencia
    else return diferencia
  }

  getDayFrom0To6(dia: number) {
    if (dia == 7) return 0
    else return dia
  }

  totalMes(anio: number, mes: number) {
    const gastosDelMes = this.gastos.filter(gasto => gasto.estaEnResumen(anio, mes))
    return gastosDelMes.reduce((acum, gasto) => acum + Number(gasto.monto_cuota), 0)
  }
}
