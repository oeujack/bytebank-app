const dayjs = require("dayjs");

exports.up = knex => knex.schema.createTable("users", table => {
  table.increments("id");
  table.text("name").notNullable();
  table.text("email").notNullable();
  table.text("password").notNullable();
  table.timestamp("created_at").default(dayjs().format('YYYY-MM-DD HH:mm:ss'));
  table.timestamp("updated_at").default(dayjs().format('YYYY-MM-DD HH:mm:ss'));
});

exports.down = knex => knex.schema.dropTable("users");