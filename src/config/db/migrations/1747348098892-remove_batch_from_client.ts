import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveBatchFromClient1747348098892 implements MigrationInterface {
    name = 'RemoveBatchFromClient1747348098892'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "batch_of_product"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" ADD "batch_of_product" text NOT NULL`);
    }

}
