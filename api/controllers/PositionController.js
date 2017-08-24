/**
 * PositionController
 *
 * @description :: Server-side logic for managing Positions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	findbest: function(req, res){

	    const params = req.allParams();

	    if (!params.channel){
	        return res.badRequest({ error: 'no channel'});
	    }

        if ( !params.lineup ) {
            return res.badRequest( { error: 'no lineup' } );
        }

        // Right now we only do network default...
        BestPosition.findOne({ lineupID: params.lineup,
            channelNumber: params.channel,
            entryType: 'network default'})
            .then( (entry)=> {
                if (entry){
                    return res.ok( { widgetLocation: entry.widgetLocation, crawlerLocation: entry.crawlerLocation });
                }
                else {
                    return res.notFound();
                }
            })
            .catch(res.serverError);

        //TODO this shoud move into a service and be better thought out
        // const listings = require('../../cache/'+params.lineup+'.json');
        //
        // if (!listings){
        //     return res.badRequest({error: 'no listings cached for that lineup'});
        // }
        //
        // const channelListings = _.find(listings, function(entry){
        //     return entry.channel.channelNumber == params.channel;
        // });
        //
        // //const now = new Date();
        //
        // return res.ok(channelListings);

	}
};

