/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("users",function(table){
    table.increments();
    table.string("nama").notNullable();
    table.string("phone").notNullable();
    table.string("username").notNullable();
    table.string("password").notNullable();
    table.string("alamat").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.smallint("is_deleted").defaultTo(0);
  }).createTable("roles",function(table){
    table.increments();
    table.string("name_roles").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  }).createTable("users_roles",function(table){
    table.integer("id_users").references("id").inTable("users");
    table.integer("id_roles").references("id").inTable("roles");
  }).createTable("resep",function(table){
    table.increments();
    table.string("keluhan").defaultTo(null);
    table.string("obat").defaultTo(null);
    table.string("aturan_pakai").defaultTo(null);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.smallint("is_deleted").defaultTo(0);
  }).createTable("produk",function(table){
    table.increments();
    table.string("nama_produk").notNullable();
    table.string("kode_produk").notNullable();
    table.integer("harga_beli").defaultTo(0);
    table.integer("harga_jual").defaultTo(0);
    table.integer("stok").defaultTo(0);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.smallint("is_deleted").defaultTo(0);
  }).createTable("transaksi_produk",function(table){
    table.increments();
    table.string("kode_transaksi").defaultTo(null);
    table.integer("id_produk").references("id").inTable("produk");
    table.integer("qty").defaultTo(0);
    table.smallint("status").defaultTo(0);
    table.integer("kasir").references("id").inTable("users");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  }).createTable("transaksi_report",function(table){
    table.increments();
    table.string("kode_transaksi").notNullable();
    table.integer("qty").defaultTo(0);
    table.integer("sub_total").defaultTo(0);
    table.integer("tunai").defaultTo(0);
    table.integer("kasir").references("id").inTable("users");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists("transaksi_report").dropTableIfExists("transaksi_produk").dropTableIfExists("users_roles").dropTableIfExists("resep").dropTableIfExists("produk").dropTableIfExists("roles").dropTableIfExists("users");
};
