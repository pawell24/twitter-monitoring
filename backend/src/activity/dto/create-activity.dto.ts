export class CreateActivityDto {
  handle: string;
  type: 'TWEET' | 'RETWEET' | 'REPLY';
  timestamp?: Date;
}
