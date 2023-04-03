const knex_psql=require("../db/knex");
const response=require("../helper/response");
const query_model=require("../model/transaksi");
const function_helper=require("../helper/function_helper");

module.exports={

    getAllReportTransaksi:async(req,res)=>{
        try {

            const {page="1",limit="10"}=req.query;

            let payload=await query_model.getAllReportTransaksi({page,limit});
            
            response.ok(payload,res);

        } catch (error) {
            response.error({},res,error.message);
        }
    },

    getAllProdukCart:async(req,res)=>{
        try {

            const {page="1",limit="10"}=req.query;

            const {users_id}=req.decoded;

            let sub_total_sum=await query_model.getAllSumTransaksiProdukkByKasir({kasir:users_id});
            sub_total_sum=sub_total_sum&&sub_total_sum['sub_total']?parseInt(sub_total_sum['sub_total']):0;
            let sub_qty_sum=await query_model.getAllSumQtyTransaksiProdukByKasir({kasir:users_id});
            sub_qty_sum=sub_qty_sum&&sub_qty_sum['sub_qty']?parseInt(sub_qty_sum['sub_qty']):0;

            let payload=await query_model.getAllTransaksiProdukByKasir({page,limit,kasir:users_id});
            
            response.ok({
                sub_total:sub_total_sum,
                qty:sub_qty_sum,
                payload
            },res);

        } catch (error) {
            response.error({},res,error.message);
        }
    },

    createTransaksiKasir:async(req,res)=>{
        try {
            const {users_id}=req.decoded;
            let {tunai}=req.body;

            let sub_total_sum=await query_model.getAllSumTransaksiProdukkByKasir({kasir:users_id});
            sub_total_sum=sub_total_sum&&sub_total_sum['sub_total']?parseInt(sub_total_sum['sub_total']):0;
            let sub_qty_sum=await query_model.getAllSumQtyTransaksiProdukByKasir({kasir:users_id});
            sub_qty_sum=sub_qty_sum&&sub_qty_sum['sub_qty']?parseInt(sub_qty_sum['sub_qty']):0;
            let kode_transaksi=`RTX-${function_helper.randomNumber(999999,100000)}-${function_helper.randomNumber(999,100)}`;
            // console.log(kode_transaksi,sub_qty_sum,sub_total_sum,parseInt(tunai));
            let tx_code=null;

            let update_status_txproduk=await knex_psql("transaksi_produk").update({status:1,kode_transaksi}).where({kasir:users_id,status:0}).whereNull("kode_transaksi").returning("*");
            if(Array.isArray(update_status_txproduk)&&update_status_txproduk.length>0){
                await knex_psql("transaksi_report").insert({
                    kasir:users_id,kode_transaksi:kode_transaksi,
                    qty:sub_qty_sum,tunai,sub_total:sub_total_sum
                });
                tx_code=kode_transaksi;
            }
            
            response.ok({},res,` Transaksi berhasil ${tx_code??""}`);
        } catch (error) {
            response.error({},res,error.message);   
        }
    },

    createTransaksiProduk:async(req,res)=>{
        try {
            const {users_id}=req.decoded;
            let {id_produk,qty}=req.body;

            let stock_decrement=await knex_psql("produk").decrement("stok",qty).where('id','=',parseInt(id_produk)).where('stok','>',0).where('stok','>=',qty).returning("*");
            if(Array.isArray(stock_decrement)&&stock_decrement.length===0) return response.error({},res,"Stok product tidak tersedia");

            await knex_psql("transaksi_produk").insert({
                kasir:users_id,
                id_produk,qty
            });
            
            return response.ok({},res,"Transaksi Produk berhasil di tambahkan");
        } catch (error) {
            return response.error({},res,error.message);   
        }
    }

};