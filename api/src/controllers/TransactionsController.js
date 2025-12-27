const knex = require("../database");
const AppError = require("../utils/AppError");

function transformTransaction(transaction) {
  const date = new Date(transaction.transaction_date);

  return {
    id: String(transaction.id), // O db.json usava string
    tipo: transaction.transaction_type === 'deposito' ? 'Depósito' : 'Pagamento',
    descricao: transaction.description,
    horario: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    valor: Number(transaction.amount),
    icone: transaction.transaction_type === 'deposito' ? 'ArrowUpCircleIcon' : 'ReceiptIcon',
    data: transaction.transaction_date.split(' ')[0], // Pega apenas YYYY-MM-DD
    conta: transaction.account_type
  };
}


class TransactionsController {
  async create(request, response) {
    // Pegamos tanto os nomes novos quanto os nomes do padrão antigo (db.json)
    const {
      account_type, conta,
      transaction_type, tipo,
      amount, valor,
      description, descricao,
      attachment_url,
    } = request.body;

    const user_id = request.user.id;

    // --- MAPEAMENTO (Adaptando o que vem do Front para o Banco) ---
    const final_account_type = account_type || conta;
    const final_amount = amount !== undefined ? amount : valor;
    const final_description = description || descricao;

    // Converte "Depósito" (Front) para "deposito" (Banco)
    let final_transaction_type = transaction_type;
    if (!final_transaction_type && tipo) {
      final_transaction_type = tipo.toLowerCase() === 'depósito' ? 'deposito' : 'transferencia';
    }

    // Validação usando os campos normalizados
    if (!final_account_type || !final_transaction_type || final_amount === undefined) {
      throw new AppError("Todos os campos obrigatórios devem ser preenchidos (conta, tipo, valor)");
    }

    if (!["conta-corrente", "poupanca"].includes(final_account_type)) {
      throw new AppError("Tipo de conta inválido");
    }

    let transactionAmount = final_amount;

    // Lógica original: se for transferência, transforma em valor negativo
    if (final_transaction_type === "transferencia") {
      transactionAmount = -Math.abs(final_amount);
    } else {
      transactionAmount = Math.abs(final_amount);
    }

    const [transaction_id] = await knex("transactions").insert({
      user_id,
      account_type: final_account_type,
      transaction_type: final_transaction_type,
      amount: transactionAmount,
      description: final_description,
      attachment_url,
      transaction_date: knex.fn.now(),
    });

    const transaction = await knex("transactions")
      .where({ id: transaction_id })
      .first();

    // MUITO IMPORTANTE: Retornar no formato que o Front-end espera (usando a função de transformação que criamos antes)
    return response.status(201).json(transformTransaction(transaction));
  }

  async index(request, response) {
    const user_id = request.user.id;

    const transactions = await knex("transactions")
      .where({ user_id })
      .orderBy("transaction_date", "desc");

    // Retorna a lista mapeada para o formato do Front-end
    const formattedTransactions = transactions.map(transformTransaction);

    return response.json(formattedTransactions);
  }

  async show(request, response) {
    const { id } = request.params;
    const user_id = request.user.id;

    const transaction = await knex("transactions").where({ id, user_id }).first();

    if (!transaction) {
      throw new AppError("Transação não encontrada");
    }

    return response.json(transformTransaction(transaction));
  }

  async show(request, response) {
    const { id } = request.params;
    const user_id = request.user.id;

    const transaction = await knex("transactions").where({ id, user_id }).first();

    if (!transaction) {
      throw new AppError("Transação não encontrada");
    }

    // Transforma apenas o objeto único
    return response.json(transformTransaction(transaction));
  }

  async update(request, response) {
    const { id } = request.params;
    const user_id = request.user.id;

    // Aceita tanto o formato novo quanto o formato antigo (db.json)
    const {
      account_type, conta,
      transaction_type, tipo,
      amount, valor,
      description, descricao,
      attachment_url,
    } = request.body;

    const transaction = await knex("transactions")
      .where({ id, user_id })
      .first();

    if (!transaction) {
      throw new AppError("Transação não encontrada");
    }

    // Normalização dos campos (Prioriza o novo, usa o antigo como fallback)
    const final_account_type = account_type || conta || transaction.account_type;
    const final_description = description !== undefined ? description : (descricao !== undefined ? descricao : transaction.description);
    const final_amount = amount !== undefined ? amount : (valor !== undefined ? valor : transaction.amount);

    let final_transaction_type = transaction_type;
    if (!final_transaction_type && tipo) {
      final_transaction_type = tipo.toLowerCase() === 'depósito' ? 'deposito' : 'transferencia';
    } else {
      final_transaction_type = transaction_type || transaction.transaction_type;
    }

    // Validações de ENUM
    if (!["conta-corrente", "poupanca"].includes(final_account_type)) {
      throw new AppError("Tipo de conta inválido");
    }

    if (!["transferencia", "deposito"].includes(final_transaction_type)) {
      throw new AppError("Tipo de transação inválido");
    }

    // Lógica de sinal do valor
    let newAmount = final_amount;
    if (final_transaction_type === "transferencia") {
      newAmount = -Math.abs(final_amount);
    } else {
      newAmount = Math.abs(final_amount);
    }

    await knex("transactions")
      .where({ id, user_id })
      .update({
        account_type: final_account_type,
        transaction_type: final_transaction_type,
        amount: newAmount,
        description: final_description,
        attachment_url: attachment_url !== undefined ? attachment_url : transaction.attachment_url,
        updated_at: knex.fn.now(),
      });

    const updatedTransaction = await knex("transactions").where({ id }).first();

    // Retorna o objeto atualizado e já formatado para o Front-end
    return response.json(transformTransaction(updatedTransaction));
  }

  async delete(request, response) {
    const { id } = request.params;
    const user_id = request.user.id;

    const transaction = await knex("transactions")
      .where({ id, user_id })
      .first();

    if (!transaction) {
      throw new AppError("Transação não encontrada");
    }

    await knex("transactions").where({ id, user_id }).delete();

    return response.status(204).send();
  }

  async getBalances(request, response) {
    const user_id = request.user.id;

    const balances = await knex("transactions")
      .where({ user_id })
      .select("account_type")
      .sum("amount as total")
      .groupBy("account_type");

    const result = {
      "conta-corrente": 0,
      poupanca: 0,
    };

    balances.forEach((balance) => {
      result[balance.account_type] = parseFloat(balance.total) || 0;
    });

    return response.json(result);
  }

}

module.exports = TransactionsController;
