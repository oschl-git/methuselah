import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1753547583240 implements MigrationInterface {
  name = "Migration1753547583240";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_xp" ("guildId" varchar(19) NOT NULL, "userId" varchar(19) NOT NULL, "username" varchar(255) NOT NULL, "messageCount" integer NOT NULL DEFAULT (0), "xp" integer NOT NULL DEFAULT (0), PRIMARY KEY ("guildId", "userId"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user_xp"`);
  }
}
