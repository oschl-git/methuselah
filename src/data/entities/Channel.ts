import { Entity, PrimaryColumn } from "typeorm";

export enum ChannelType {
  WELCOME = "welcome",
}

@Entity("channels")
export default class Channel {
  @PrimaryColumn({ type: "varchar", length: 19 })
  channelId!: string;

  @PrimaryColumn({ type: "varchar", length: 19 })
  guildId!: string;

  @PrimaryColumn({ type: "varchar", length: 32 })
  type!: ChannelType;
}
