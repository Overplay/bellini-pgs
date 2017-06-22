/**
 * Created by cgrigsby on 10/10/16.
 */
var request = require('superagent-bluebird-promise');
var moment = require('moment');

module.exports = function lineupFetchHook(sails) {

  var fetchConfig;
  var cronDelay;


  return {

    configure: function () {
      if (!sails.config.hooks.lineupFetch || !sails.config.hooks.lineupFetch.hookEnabled) {
        sails.log.warn("There's no config file for device or its hook is disabled... ");
      }

      fetchConfig = sails.config.hooks.lineupFetch;
    },

    initialize: function (cb) {
      if (!fetchConfig || !fetchConfig.hookEnabled) {
        sails.log.warn("There's no config file for device or its hook is disabled... ");
        return cb();
      }
      //timeout = (1000 * 60);
      cronDelay = fetchConfig.delay || (1000 * 60 * 60 * 12);
      //cronDelay = 10000;
      sails.log.debug('Lineup Fetches every: ' + cronDelay / 1000 + 's');

      setTimeout(sails.hooks.lineupfetchhook.fetch, 60000);//TODO
//      setTimeout(sails.hooks.lineupfetchhook.fetch, cronDelay);


      return cb();

    },

    fetch: function (timeout) {
      //step through devices and delete ones that aren't registered after the timeout
      var timeout = typeof(timeout) == 'undefined';
      sails.log.debug(timeout);
      sails.log.info('Begin updating lineups');

      Lineup.find({active: true})
        .then(function (lineups) {

          async.eachSeries(lineups, function (lineup, cb) {
            //save the lineup THEN retrieve and parse listings
            sails.log.debug(lineup);

//            if(moment(lineup.updatedAt).isAfter(moment().subtract(12,'hours'))){
//              sails.log.debug("recently updated ");
//              return cb()
//            }

            var endTime = moment().add(2, 'days').subtract(1, 'millisecond').toISOString();

            request
              .get(sails.config.tvmedia.url + '/lineups/' + lineup.lineupID + "/listings/grid")
              .query({lineupID: lineup.lineupID, api_key: sails.config.tvmedia.api_key, end: endTime, timezone: sails.config.tvmedia.timezone})
              .then(function (res) {
                sails.log.verbose("Found " + res.body.length + " channels");
                return LineupParsingService.parse(res.body, lineup.id);
              })
              .then(function(){
                sails.log.debug("callback");
                //only updates time if above completes :)
                lineup.updatedAt = moment().toISOString();
                lineup.save(function(){
                  return cb();

                });
              })
              .catch(function(err){
                sails.log.debug("Error fetching lineup data");
                return cb(err)
              })
          }, function(err){
            if (err){
              sails.log.debug("Lineup not updated" + err.message);
              //retry? //TODO THIS IS BAD PROBSKIS MAYBE TEXTBAD
              setTimeout(sails.hooks.lineupfetchhook.fetch(false), 1000 * 60 * 30);
            }
          });

          if (timeout)
            setTimeout(sails.hooks.lineupfetchhook.fetch, cronDelay);

      })
    }
  }
};
