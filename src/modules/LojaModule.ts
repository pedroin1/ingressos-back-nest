import { Module } from '@nestjs/common';
import { LojaController } from 'src/controller/LojaController';
import { LojaRepository } from 'src/repository/LojaRepository';

@Module({
  controllers: [LojaController],
  providers: [LojaRepository],
})
export class LojaModule {}
