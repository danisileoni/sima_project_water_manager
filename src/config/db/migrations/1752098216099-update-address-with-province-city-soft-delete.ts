import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAddressWithProvinceCitySoftDelete1752098216099 implements MigrationInterface {
    name = 'UpdateAddressWithProvinceCitySoftDelete1752098216099'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "city" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "province" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "address" ADD "deletedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "province" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "city" DROP COLUMN "deletedAt"`);
    }

}
