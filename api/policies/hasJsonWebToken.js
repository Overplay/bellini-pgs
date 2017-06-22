/**
 * hasJsonWebToken
 *
 * @module      :: Policy
 * @description :: Assumes that your request has an jwt;
 *
 * @docs        :: http://waterlock.ninja/documentation
 */

// TODO: Should be able to combine this with the other auth policies to create a single
// Policy.


//Waterlock methods to get user and stuff too so we should figure it out
module.exports = function (req, res, next) {

    // Check for "god token"

    if ( sails.config.policies.godToken ){
        if ( req.headers.authorization && req.headers.authorization=="Bearer OriginalOG")
            next();
    }

    waterlock.validator.validateTokenRequest(req, function (err, user) {
        if (err) {
            return res.forbidden({error: err.message});
        }

        // valid request
        next();
    });
};
