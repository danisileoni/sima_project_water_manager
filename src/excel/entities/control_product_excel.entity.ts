import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ControlProductExcel {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text', { nullable: false })
  name: string;

  @Column('text', { nullable: false })
  path: string;

  @Column('date', { nullable: false })
  date: Date;

  @Column('text', { nullable: false })
  file_id: string;

  @Column('date', { nullable: false, default: new Date().toISOString() })
  created_at: Date;

  @Column('date', {
    nullable: false,
    default: new Date().toISOString(),
    onUpdate: new Date().toISOString(),
  })
  updated_at: Date;
}
