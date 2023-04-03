const response=require("../helper/response");

module.exports=(err,req,res,next) => {
    let message=err.message;

    response.error({},res,message);
};