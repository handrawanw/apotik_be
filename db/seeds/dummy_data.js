/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  
  await knex('users_roles').del()
  await knex('users').del()
  await knex('roles').del()
  
  await knex('users').insert([
    {id: 1, nama:"wawan", phone:"081234567891", username:"handrawanw", password:"$2a$10$v3XLHBlrFGdrdX7BWhpCvu2Ip1t5GyqkixXSBbUihb8ziwiPb8Ozi", alamat:"JL Teluk Gong Timur"},
  ]);

  await knex('roles').insert([
    {id: 1, name_roles:"Admin"},
    {id: 2, name_roles:"Karyawan"},
    {id: 3, name_roles:"Dokter"}
  ]);
  
  await knex('users_roles').insert([
    {id_roles:1,id_users:1},
  ]);

};
