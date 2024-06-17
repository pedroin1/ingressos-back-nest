import { Module } from '@nestjs/common';
import { LojaModule } from './modules/LojaModule';

@Module({
  imports: [LojaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
