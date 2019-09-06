import { BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, Entity } from "typeorm"
import { Gasto } from "./gasto"

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

    @Column()
    dia_regla_cierre_resumen: number // día dentro de la semana 0-6

    @Column()
    semana_regla_cierre_resumen: number // semana dentro de un mes 0-3

    @Column()
    dia_regla_vencimiento: number // día dentro de la semana 0-6

    @Column()
    semana_regla_vencimiento: number // semana dentro de un mes 0-3

    fechaDeCierre(anio: number, mes: number) {
        let fecha = new Date(anio, mes - 1, 1)
        const diferencia_dia_regla_primer_dia_mes = this.dia_regla_cierre_resumen - fecha.getDay()

        fecha.setDate(fecha.getDate() + 7 * this.semana_regla_cierre_resumen + this.ajusteDia(diferencia_dia_regla_primer_dia_mes))

        if (fecha.getMonth() > mes - 1) fecha.setDate(fecha.getDate() - 7)  //EN EL CASO DE QUE LA REGLA SEA LA 5TA SEMANA Y ESE DIA TIENE SOLO 4 EN ESE MES, LE RESTA 7 DIAS PARA DEVOLVER EL 4TO.

        return fecha
    }

    ajusteDia(diferencia: number) {
        if (diferencia < 0)
            return 7 + diferencia
        else
            return diferencia
    }
}
