import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    ManyToMany,
    JoinTable,
    ManyToOne,
} from "typeorm"
import { Moneda } from "./moneda"
import { Tag } from "./tag"
import { Tarjeta } from "./tarjeta"

@Entity()
export class Gasto extends BaseEntity {
    constructor(init?: Partial<Gasto>) {
        super()
        Object.assign(this, init)
    }

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    producto: string
    @Column()
    comercio: string = ""
    @Column()
    monto_total: number = 0
    @ManyToOne(type => Moneda)
    @JoinColumn()
    moneda: Moneda
    @Column()
    cuotas: number = 1
    @Column()
    fecha: Date = new Date()
    @Column()
    mes_primer_resumen: number = this.fecha.getMonth() + 1
    @Column()
    paga_iva: boolean = false
    @Column()
    monto_iva: number = 0
    @ManyToMany(type => Tag, tag => tag.gastos, {
        cascade: true,
    })
    @JoinTable()
    tags: Tag[]
    @ManyToOne(type => Tarjeta, tarjeta => tarjeta.gastos, { nullable: false })
    tarjeta: Tarjeta
}
