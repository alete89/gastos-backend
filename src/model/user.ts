import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Tarjeta } from './tarjeta'

@Entity('users')
export class User extends BaseEntity {
  constructor(init?: Partial<User>) {
    super()
    Object.assign(this, init)
  }

  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  email: string

  @Column({ select: false })
  password: string

  @Column({ default: 0 })
  tokenVersion: number

  @OneToMany((type) => Tarjeta, (tarjeta) => tarjeta.user, { cascade: true })
  tarjeta: Tarjeta[]
}
