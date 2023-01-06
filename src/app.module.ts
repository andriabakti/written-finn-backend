import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      ignoreEnvFile: true,
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: async () => {
        const uri =
          process.env.NODE_ENV == 'development'
            ? `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_NAME}?directConnection=true`
            : `mongodb://${process.env.MONGODB_USER}:${encodeURIComponent(
                process.env.MONGODB_PASS,
              )}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${
                process.env.MONGODB_NAME
              }`;
        console.log('uri >', uri);
        return {
          uri: uri,
          useCreateIndex: true,
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useFindAndModify: false,
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // constuctor() { };
  async onApplicationBootstrap() {
    //
  }
}
