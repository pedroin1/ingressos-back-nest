import { Body, Controller, Get, Post } from '@nestjs/common';
import { VendaDTO } from 'src/models/LojaModels';
import { LojaRepository } from 'src/repository/LojaRepository';

@Controller('venda')
export class LojaController {
  constructor(private readonly repository: LojaRepository) {}

  @Get('vendas')
  async getVendas() {
    return await this.repository.listarVendas();
  }

  @Post('criarVenda')
  async createVenda(@Body() vendaDto: VendaDTO) {
    return await this.repository.criarVenda(vendaDto);
  }
}
