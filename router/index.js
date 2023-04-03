const Router=require("express").Router();

Router.use("/service_users",require("./service_users"))
Router.use("/users",require("./users"))
Router.use("/produk",require("./produk"))
Router.use("/transaksi",require("./transaksi"))

module.exports=Router;