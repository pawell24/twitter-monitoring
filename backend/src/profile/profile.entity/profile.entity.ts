import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Activity } from '../../activity/activity.entity/activity.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  handle: string;

  @OneToMany(() => Activity, (activity: Activity) => activity.profile)
  activities: Activity[];
}
