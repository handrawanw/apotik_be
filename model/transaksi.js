const knex_psql=require("../db/knex");
const query_helper=require("../helper/query_helper");

module.exports={

    getAllReportTransaksi:async({page,limit})=>{

        let offset=query_helper.parsePageToOffset({page,limit});

        let select=[
           "tr.*","users.nama as kasir"
        ];

        let query=knex_psql.from("transaksi_report as tr");

        query.innerJoin("users","users.id","tr.kasir");

        let count=0;
        
        if(page&&limit){
            let count_query=Object.assign(query,query);

            count_query=count_query.count("*");

            count=await count_query
            count=Array.isArray(count)&&count.length>0?count[0].count:0;

            query.offset(offset);
            query.limit(limit);
        }

        query.clearSelect().select(select);

        let payload=await query;

        let result={
            per_page:parseInt(limit),
            last_page:Math.ceil(parseInt(count)/parseInt(limit)),
            current_page:parseInt(page),
            payload,
            total_data:parseInt(count),
        };

        return result;

    },

    getAllTransaksiProdukByKasir:async({kasir})=>{

        let query=knex_psql.select([
            "produk.id","produk.kode_produk","produk.nama_produk","produk.harga_jual","tp.qty",
            knex_psql.raw("(produk.harga_jual*tp.qty) as sub_total")
        ]).from("transaksi_produk as tp")

        query.innerJoin("produk",function(){
            this.on("produk.id","=","tp.id_produk")
        })

        query.where("tp.kasir",kasir)
        query.where("tp.status",0)

        return query;
    },

    getAllSumTransaksiProdukkByKasir:async({kasir})=>{

        let query=knex_psql.select([
            knex_psql.raw("sum(produk.harga_jual*tp.qty) as sub_total")
        ]).from("transaksi_produk as tp")

        query.innerJoin("produk",function(){
            this.on("produk.id","=","tp.id_produk")
        })

        query.where("tp.kasir",kasir)
        query.where("tp.status",0)

        query.first()

        return query;
    },

    getAllSumQtyTransaksiProdukByKasir:async({kasir})=>{

        let query=knex_psql.select([
            knex_psql.raw("sum(tp.qty) as sub_qty")
        ]).from("transaksi_produk as tp")

        query.innerJoin("produk",function(){
            this.on("produk.id","=","tp.id_produk")
        })

        query.where("tp.kasir",kasir)
        query.where("tp.status",0)

        query.first()

        return query;
    },

};