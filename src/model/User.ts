import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity("users")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  //   @Column({ select: false })
  @Column()
  password: string;

  @Column({ default: 0 })
  tokenVersion: number;
}
