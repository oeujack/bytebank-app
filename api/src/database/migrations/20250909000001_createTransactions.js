const dayjs = require("dayjs");

exports.up = function (knex) {
  return knex.schema.createTable('transactions', function (table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.enum('account_type', ['conta-corrente', 'poupanca']).notNullable();
    table.enum('transaction_type', ['transferencia', 'deposito', 'pagamento']).notNullable();
    table.decimal('amount', 10, 2).notNullable();
    table.text('description').nullable();
    table.text('attachment_url').nullable();
    table.timestamp('transaction_date').defaultTo(dayjs().format('YYYY-MM-DD HH:mm:ss'));
    table.timestamp('created_at').defaultTo(dayjs().format('YYYY-MM-DD HH:mm:ss'));
    table.timestamp('updated_at').defaultTo(dayjs().format('YYYY-MM-DD HH:mm:ss'));

    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('transactions');
};
