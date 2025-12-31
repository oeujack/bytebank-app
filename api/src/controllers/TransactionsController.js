const knex = require("../database");
const AppError = require("../utils/AppError");
const dayjs = require("dayjs");

function transformTransaction(transaction) {
  const date = new Date(transaction.transaction_date);
  const dataFormatada = transaction.transaction_date instanceof Date 
    ? transaction.transaction_date.toISOString().split('T')[0]
    : String(transaction.transaction_date).split(' ')[0];

  return {
    id: String(transaction.id),
    tipo: transaction.transaction_type === 'transferencia' ? 'Transferência' : 
          transaction.transaction_type === 'deposito' ? 'Depósito' : 
          transaction.transaction_type === 'pagamento' ? 'Pagamento' : 'Outros',
    descricao: transaction.description,
    horario: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    valor: Number(transaction.amount),
    icone: transaction.transaction_type === 'deposito' ? 'ArrowUpCircleIcon' : 'ReceiptIcon',
    data: dataFormatada,
    conta: transaction.account_type
  };
}

class TransactionsController {
  async create(request, response) {
    const {
      account_type, conta,
      transaction_type, tipo,
      amount, valor,
      description, descricao,
      attachment_url,
    } = request.body;

    const user_id = request.user.id;

    const final_account_type = account_type || conta;
    const final_amount = amount !== undefined ? amount : valor;
    const final_description = description || descricao;

    let final_transaction_type = transaction_type;
    if (!final_transaction_type && tipo) {
      const t = tipo.toLowerCase();
      if (t.includes('depósito') || t.includes('deposito')) final_transaction_type = 'deposito';
      else if (t.includes('pagamento')) final_transaction_type = 'pagamento';
      else final_transaction_type = 'transferencia';
    }

    if (!final_account_type || !final_transaction_type || final_amount === undefined) {
      throw new AppError("Campos obrigatórios ausentes");
    }

    let transactionAmount = Math.abs(Number(final_amount));
    if (final_transaction_type === "transferencia" || final_transaction_type === "pagamento") {
      transactionAmount = -transactionAmount;
    }

    const [transaction_id] = await knex("transactions").insert({
      user_id,
      account_type: final_account_type,
      transaction_type: final_transaction_type,
      amount: transactionAmount,
      description: final_description,
      attachment_url,
      transaction_date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    });

    const transaction = await knex("transactions").where({ id: transaction_id }).first();
    return response.status(201).json(transformTransaction(transaction));
  }

  async index(request, response) {
    const user_id = request.user.id;
    const transactions = await knex("transactions")
      .where({ user_id })
      .orderBy("transaction_date", "desc");

    return response.json(transactions.map(transformTransaction));
  }

  async show(request, response) {
    const { id } = request.params;
    const user_id = request.user.id;
    const transaction = await knex("transactions").where({ id, user_id }).first();

    if (!transaction) throw new AppError("Transação não encontrada");
    return response.json(transformTransaction(transaction));
  }

  async update(request, response) {
    const { id } = request.params;
    const user_id = request.user.id;
    const { account_type, conta, transaction_type, tipo, amount, valor, description, descricao, attachment_url } = request.body;

    const transaction = await knex("transactions").where({ id, user_id }).first();
    if (!transaction) throw new AppError("Transação não encontrada");

    let final_transaction_type = transaction_type || transaction.transaction_type;
    if (tipo && !transaction_type) {
        const t = tipo.toLowerCase();
        if (t.includes('depósito') || t.includes('deposito')) final_transaction_type = 'deposito';
        else if (t.includes('pagamento')) final_transaction_type = 'pagamento';
        else final_transaction_type = 'transferencia';
    }

    if (!["transferencia", "deposito", "pagamento"].includes(final_transaction_type)) {
      throw new AppError("Tipo de transação inválido");
    }

    const final_amount = amount !== undefined ? amount : (valor !== undefined ? valor : transaction.amount);
    let newAmount = Math.abs(Number(final_amount));
    if (final_transaction_type === "transferencia" || final_transaction_type === "pagamento") {
      newAmount = -newAmount;
    }

    await knex("transactions").where({ id, user_id }).update({
      account_type: account_type || conta || transaction.account_type,
      transaction_type: final_transaction_type,
      amount: newAmount,
      description: description !== undefined ? description : (descricao !== undefined ? descricao : transaction.description),
      attachment_url: attachment_url !== undefined ? attachment_url : transaction.attachment_url,
      updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    });

    const updated = await knex("transactions").where({ id }).first();
    return response.json(transformTransaction(updated));
  }

  async delete(request, response) {
    const { id } = request.params;
    const user_id = request.user.id;
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

    const result = { "conta-corrente": 0, poupanca: 0 };
    balances.forEach((b) => { result[b.account_type] = parseFloat(b.total) || 0; });
    return response.json(result);
  }
}

module.exports = TransactionsController;