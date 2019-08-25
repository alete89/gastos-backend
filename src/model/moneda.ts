import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Moneda extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    nombre: string
    @Column({ nullable: false })
    cotizacion: number = 1
}
