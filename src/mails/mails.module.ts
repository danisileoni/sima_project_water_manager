import { Module } from '@nestjs/common';
import { MailsService } from './mails.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { envs } from 'src/config/config';

@Module({
  providers: [MailsService],
  exports: [MailsService],
  imports: [
    MailerModule.forRootAsync({
      inject: [],
      useFactory: () => ({
        transport: {
          host: envs.mailFrom,
          source: false,
          port: envs.mailPort,
          auth: {
            user: envs.mailUser,
            pass: envs.mailPass,
          },
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            static: true,
          },
        },
      }),
    }),
  ],
})
export class MailsModule {}
