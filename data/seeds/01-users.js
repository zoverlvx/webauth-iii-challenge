exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("users").insert([
      {
          username: "Zach",
          password: "hashashashashash",
          department: "Produce"
      }         
  ]);
};
