import { MigrationInterface, QueryRunner } from "typeorm";

export class Model1724157621899 implements MigrationInterface {
    name = 'Model1724157621899'

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
                CONSTRAINT "PK_a6610ad4c60b148aebb53530b37" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_fcca00e6dc7673581492ece5e3" ON "air_quality" ("latitude", "longitude")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "public"."IDX_fcca00e6dc7673581492ece5e3"
        `);
        await queryRunner.query(`
            DROP TABLE "air_quality"
        `);
    }

}
