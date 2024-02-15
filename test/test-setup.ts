import { ConfigModule } from "@nestjs/config";

const envFile = process.env.NODE_ENV === 'test' ? '.env.test.local' : '.env.development.local';

ConfigModule.forRoot({
    envFilePath: envFile,
});
