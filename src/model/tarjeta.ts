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
}
