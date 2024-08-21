import { MigrationInterface, QueryRunner } from "typeorm";

export class Airquality1724235958517 implements MigrationInterface {
    name = 'Airquality1724235958517'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "air_quality" (
                "id" SERIAL NOT NULL,
                "ts" TIMESTAMP NOT NULL,
                "aqius" character varying NOT NULL,
                "mainus" character varying NOT NULL,
                "aqicn" character varying NOT NULL,
                "maincn" character varying NOT NULL,
                "latitude" double precision NOT NULL,
                "longitude" double precision NOT NULL,
                "recordedAt" TIMESTAMP NOT NULL,
                CONSTRAINT "PK_a6610ad4c60b148aebb53530b37" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_0e7a85787ef4f68b24406c4963" ON "air_quality" ("latitude", "longitude", "ts", "recordedAt")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "public"."IDX_0e7a85787ef4f68b24406c4963"
        `);
        await queryRunner.query(`
            DROP TABLE "air_quality"
        `);
    }

}
