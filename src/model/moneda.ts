import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Moneda extends BaseEntity {
  constructor(init?: Partial<Moneda>) {
    super()
    Object.assign(this, init)
  }

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  nombre: string

  @Column({ nullable: false })
  cotizacion: number = 1
}
