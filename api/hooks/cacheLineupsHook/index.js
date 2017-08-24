/**
 * Created by ryanhartzell on 10/26/16.
 */

var request = require('superagent-bluebird-promise');
var moment = require('moment');
var fs = require('fs');

module.exports = function cacheLineupsHook(sails) {

  var config;
  var cronDelay;

  return {

    configure: function () {
      if (!sails.config.hooks.cacheLineups || !sails.config.hooks.cacheLineups.hookEnabled)
        sails.log.warn("There's no config file for device or its hook is disabled... ");

      config = sails.config.hooks.cacheLineups;
    },

    initialize: function (cb) {
      if (!config || !config.hookEnabled) {
        sails.log.warn("There's no config file for device or its hook is disabled... ");
        return cb();
      }

      cronDelay = config.delay || (1000 * 60 * 60); // one hour

      setTimeout(sails.hooks.cachelineupshook.cache, 5000);

      return cb();
    },

    cache: function () {

      sails.log.info("Caching lineups");

      fs.mkdir("./cache", function (err) {
        if (err && err.code === "EEXIST")
          sails.log.debug("cache already exists");
        else if (err) {
          sails.log.error("Error creating cache");
          return null;
        }
        else
          sails.log.debug("cache created");

        Lineup.find({})
          .then( function (lineups) {

            async.eachSeries(lineups, function (lineup, cb) {
              var startTime = moment().subtract(30, 'minutes').toISOString();

              request
                .get(sails.config.tvmedia.url + '/lineups/' + lineup.lineupID + '/listings/grid')
                .query({lineupID: lineup.lineupID, api_key: sails.config.tvmedia.api_key, start: startTime, timezone: sails.config.tvmedia.timezone})
                .then( function (res) {
                  // TODO validate JSON
                  fs.writeFile("./cache/" + lineup.lineupID + '.json', JSON.stringify(res.body), function (err) {
                    if (err) {
                      return cb(err);
                    }
                    sails.log.debug('Lineup ' + lineup.lineupID + " cached");
                    return cb();
                  })
                })
                .catch( function (err) {
                  sails.log.error("Error fetching lineup data");
                  return cb(err);
                })
            }, function (err) {
              if (err) {
                sails.log.error("Lineup not updated" + err.message);
                setTimeout(sails.hooks.cachelineupshook.catch, 1000 * 60 * 5) // retry in five minutes
              }
              else {
                sails.log.debug("Lineups cached");
              }
            })
          });
      });

      setTimeout(sails.hooks.cachelineupshook.cache, cronDelay);

    }
  }


}
