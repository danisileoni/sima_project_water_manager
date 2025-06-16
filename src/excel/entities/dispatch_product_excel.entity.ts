import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DispatchProductExcel {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text', { nullable: false })
  file_name: string;

  @Column('text', { nullable: false })
  path: string;

  @Column('date', { nullable: false })
  date: Date;

  @Column('text', { nullable: false })
  file_id: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
