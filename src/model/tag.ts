import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm'
import { Gasto } from './gasto'

@Entity()
export class Tag extends BaseEntity {
    constructor(init?: Partial<Tag>) {
        super()
        Object.assign(this, init)
    }

    @PrimaryGeneratedColumn()
    id: number
    @Column()
    nombre: string
    @ManyToMany(type => Gasto, gasto => gasto.tags)
    gastos: Gasto[]
}
