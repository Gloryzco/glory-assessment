import { IAirQuality } from 'src/shared';
import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity()
@Index(['latitude', 'longitude', 'ts', 'recordedAt'])
export class AirQuality implements IAirQuality {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  ts: Date;

  @Column({ type: 'int' })
  aqius: number;

  @Column({ type: 'varchar' })
  mainus: string;

  @Column({ type: 'int' })
  aqicn: number;

  @Column({ type: 'varchar' })
  maincn: string;

  @Column({ type: 'double precision' })
  latitude: number;

  @Column({ type: 'double precision' })
  longitude: number;

  @Column({ type: 'timestamp' })
  recordedAt: Date;
}
