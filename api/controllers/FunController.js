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
        res.ok("Well, that was fun!");
    },

    nofun: function(req, res){
        res.notFound("I cannot find fun!");
    }

}