import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewAtributeDispatch1749756462767 implements MigrationInterface {
    name = 'AddNewAtributeDispatch1749756462767'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_dispatch" ADD "user_dispatch_id" uuid`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ADD CONSTRAINT "FK_f8782510b8dced00f5ea30ca7ed" FOREIGN KEY ("user_dispatch_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_dispatch" DROP CONSTRAINT "FK_f8782510b8dced00f5ea30ca7ed"`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" DROP COLUMN "user_dispatch_id"`);
    }

}
