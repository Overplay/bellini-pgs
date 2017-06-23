/**
 * Created by mkahn on 6/21/17.
 */

/*********************************

 File:       FunController.js
 Function:   This is just here as an example for NOOBS
 Copyright:  Ourglass TV
 Date:       6/21/17 3:27 PM
 Author:     mkahn

 Enter detailed description

 **********************************/

module.exports = {

    fun: function(req, res){

        switch (req.method){

            case 'GET':
                return res.ok( "Well, that was fun!" );
                break;

            case 'DELETE':
                return res.ok( "Don't delete my fun" );
                break;

            case 'POST':
                return res.ok( "Posting up some fun" );
                break;

            default:
                return res.badRequest({ error: 'bugger off'});

        }

    },

    nofun: function(req, res){
        res.notFound("I cannot find fun!");
    }

}