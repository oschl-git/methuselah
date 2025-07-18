import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("reaction_roles")
export default class ReactionRole {
  @PrimaryColumn({ type: "varchar", length: 19 })
  messageId!: string;

  @PrimaryColumn({ type: "varchar" })
  emoji!: string;

  @Column({ type: "varchar", length: 19 })
  roleId!: string;

  @Column({ type: "boolean" })
  custom!: boolean;
}
