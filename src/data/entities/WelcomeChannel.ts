import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("welcome_channels")
export default class WelcomeChannel {
  @PrimaryColumn({ type: "varchar", length: 19 })
  channelId!: string;

  @Column({ type: "varchar", length: 19 })
  guildId!: string;
}