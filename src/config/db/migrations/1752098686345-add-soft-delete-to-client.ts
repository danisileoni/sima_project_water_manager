import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSoftDeleteToClient1752098686345 implements MigrationInterface {
    name = 'AddSoftDeleteToClient1752098686345'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" ADD "deletedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "deletedAt"`);
    }

}
