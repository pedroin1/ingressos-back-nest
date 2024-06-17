-- CreateTable
CREATE TABLE "tb_venda" (
    "id" TEXT NOT NULL,
    "nome_produto" VARCHAR(200) NOT NULL,
    "valor_venda" MONEY NOT NULL DEFAULT 0.0,
    "qtd_comprada" INTEGER NOT NULL,
    "dt_venda" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_venda_pkey" PRIMARY KEY ("id")
);
