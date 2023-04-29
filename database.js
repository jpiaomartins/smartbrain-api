const knex = require('knex')

const database = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'admin',
      password : 'admin',
      database : 'smartbrain'
    }
  });

module.exports = database;