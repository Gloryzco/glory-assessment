import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity()
@Index(['latitude', 'longitude'])
export class AirQuality {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  ts: Date;

  @Column({ type: 'varchar' })
  aqius: string;

  @Column({ type: 'varchar' })
  mainus: string;

  @Column({ type: 'varchar' })
  aqicn: string;

  @Column({ type: 'varchar' })
  maincn: string;

  @Column({ type: 'double precision' })
  latitude: number;

  @Column({ type: 'double precision'})
  longitude: number;
}
