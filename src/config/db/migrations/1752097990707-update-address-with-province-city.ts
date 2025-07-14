import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAddressWithProvinceCity1752097990707 implements MigrationInterface {
    name = 'UpdateAddressWithProvinceCity1752097990707'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "city" ("id" SERIAL NOT NULL, "name" text NOT NULL, "postal_code" text, "provinceId" integer, CONSTRAINT "PK_b222f51ce26f7e5ca86944a6739" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "province" ("id" SERIAL NOT NULL, "name" text NOT NULL, "country" text, CONSTRAINT "PK_4f461cb46f57e806516b7073659" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "state_or_province"`);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "city"`);
        await queryRunner.query(`ALTER TABLE "address" ADD "provinceId" integer`);
        await queryRunner.query(`ALTER TABLE "address" ADD "cityId" integer`);
        await queryRunner.query(`ALTER TABLE "city" ADD CONSTRAINT "FK_95959bed787b5e4fd4be4e94fc5" FOREIGN KEY ("provinceId") REFERENCES "province"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_6b08d352c02976faa2b4b2933c3" FOREIGN KEY ("provinceId") REFERENCES "province"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_3624b3085165071df70276a4000" FOREIGN KEY ("cityId") REFERENCES "city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_3624b3085165071df70276a4000"`);
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_6b08d352c02976faa2b4b2933c3"`);
        await queryRunner.query(`ALTER TABLE "city" DROP CONSTRAINT "FK_95959bed787b5e4fd4be4e94fc5"`);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "cityId"`);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "provinceId"`);
        await queryRunner.query(`ALTER TABLE "address" ADD "city" text`);
        await queryRunner.query(`ALTER TABLE "address" ADD "state_or_province" text`);
        await queryRunner.query(`DROP TABLE "province"`);
        await queryRunner.query(`DROP TABLE "city"`);
    }

}
