const jwt_token = require("../helper/jwt_token");
const response = require("../helper/response");

module.exports = {

    authJwt: async (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1];
        jwt_token.verifytoken(token, (err, payload) => {
            if (err) {
                response.unauthorized({
                    isTokenExpired: true
                }, res);
            } else {
                req.decoded = payload;
                next();
            }
        });
    },

    authRole: (roles = []) => (req, res, next) => {
        let name_roles=req.decoded?.name_roles;
        if(name_roles){
            for(let item of roles){
                if(item.toLowerCase()===name_roles.toLowerCase()){
                    return next();
                }
            }
        }
        return response.unauthorized({
            isTokenExpired: false
        }, res);

    }

};