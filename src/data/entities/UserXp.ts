import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("user_xp")
export default class UserXp {
  @PrimaryColumn({ type: "varchar", length: 19 })
  guildId!: string;

  @PrimaryColumn({ type: "varchar", length: 19 })
  userId!: string;

	@Column({ type: "varchar", length: 255 })
	username!: string;

  @Column({ type: "int", default: 0 })
  messageCount = 0;

  @Column({ type: "int", default: 0 })
  xp = 0;
}
