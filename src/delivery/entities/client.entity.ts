import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Client {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text', {
    nullable: false,
  })
  name_or_company: string;

  @Column('text', {
    nullable: false,
  })
  contact: string;

  @Column('numeric', {
    nullable: false,
  })
  quantity: number;

  @Column('text')
  observations: string;

  @Column('numeric', {
    nullable: false,
  })
  dni_cuit: number;

  @Column('text', {
    nullable: false,
  })
  batch_of_product: string;

  @Column('date', {
    nullable: false,
    default: new Date().toISOString(),
  })
  created_at: Date;

  @Column('date', {
    nullable: false,
    default: new Date().toISOString(),
    onUpdate: new Date().toISOString(),
  })
  updated_at: Date;
  @ManyToOne(() => User, (user) => user.client)
  user: User;
}
