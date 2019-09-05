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
}
