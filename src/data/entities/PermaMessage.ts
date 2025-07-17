import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("permamessages")
export default class PermaMessage {
  @PrimaryColumn({ type: "varchar", length: 19 })
  channelId!: string;

  @Column({ type: "varchar", length: 19, nullable: true })
  sentMessageId?: string;

  @Column({ type: "text" })
  content!: string;
}
