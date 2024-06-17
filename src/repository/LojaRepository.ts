import { Injectable } from '@nestjs/common';
import prismaClient from '../prisma/client';
import { VendaDTO } from 'src/models/LojaModels';

@Injectable()
export class LojaRepository {
  async listarVendas() {
    return await prismaClient.venda.findMany();
  }

  async criarVenda(vendaDto: VendaDTO) {
    return await prismaClient.venda.create({
      data: {
        nomeProduto: vendaDto.nomeProduto,
        quantidadeComprada: vendaDto.quantidadeComprada,
        valorProduto: vendaDto.valorProduto,
      },
    });
  }
}
