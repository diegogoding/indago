const knex = require('../db/connection');

const Plans = {
  by_id: function(id) {
    return knex('plans')
      .first()
      .where({
        id: id
      });
  },
  by_user_id: function(user_id) {
    return knex('plans')
      .where({
        user_id : user_id,
      });
  },
  insert: function(plan) {
    return knex('plans')
      .insert(plan)
      //TODO: reformat database and return proper columns
      .returning();
  }
};

module.exports = Plans;