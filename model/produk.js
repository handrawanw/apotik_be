const knex_psql=require("../db/knex");
const query_helper=require("../helper/query_helper");

module.exports={

    getAllProduk:async({page,limit})=>{

        let offset=query_helper.parsePageToOffset({page,limit});

        let select=[
           "*"
        ];

        let query=knex_psql.from("produk");

        query.where("produk.is_deleted",0)

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
    }

};