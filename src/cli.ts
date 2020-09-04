import { BootstrapConsole } from 'nestjs-console';
import { AppModule } from './app.module';

async function bootstrap() {
  const ñConsole = new BootstrapConsole({
    module: AppModule,
    useDecorators: true,
  });

  const app = await ñConsole.init();
  await app.init();
  await ñConsole.boot();
}

bootstrap()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
