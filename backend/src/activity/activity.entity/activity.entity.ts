import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Profile } from '../../profile/profile.entity/profile.entity';

@Entity()
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: string;

  @Column()
  timestamp: Date;

  @ManyToOne(() => Profile, (profile: Profile) => profile.activities)
  @JoinColumn()
  profile: Profile;
}
