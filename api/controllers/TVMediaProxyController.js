/**
 * TVMediaProxyController
 *
 * @description :: Server-side logic for managing Tvmediaproxies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var fs = require('fs');
var request = require('superagent-bluebird-promise');

module.exports = {

  addLineup: function (req, res) {

    if (req.method !== "POST") {
      return res.badRequest({ error: "Wrong verb; must be POST"});
    }

    var params = req.allParams();

    if (!params.lineupID) {
      return res.badRequest({ error: "Missing lineupID" });
    }

    return Lineup.find({ lineupID : params.lineupID })
      .then( function (l) {
        if (l.length)
          return res.badRequest({ error: "Lineup " + params.lineupID + " already exists in database" });

        return request
          .get(sails.config.tvmedia.url + '/lineups/' + params.lineupID)
          .query({lineupID: params.lineupID, api_key: sails.config.tvmedia.api_key})
          .catch( function (err) {
            return res.serverError({ error: "Error fetching lineup data" });
          })
          .then( function (data) {
            sails.log.verbose("Lineup " + params.lineupID + " found");
            delete data.body.stations;

            return Lineup.create(data.body)
              .then( function (lineup) {
                return res.ok(lineup);
              })
              .catch( function (err) {
                return res.serverError({ error : "Error creating lineup" });
              })
          })
      })


  },

  fetch: function (req, res) {

    if (req.method !== "GET") {
      return res.badRequest({ error: "Wrong verb" });
    }

    var params = req.allParams();

    if (!params.id) {
      return res.badRequest({ error: "Missing lineupID" });
    }

    fs.readFile('./cache/' + params.id + '.json', 'utf8', function (err, data) {
      if (err) {
        if (err.code = "ENOENT")
          return res.notFound({ error : "Cache file for lineup " + params.id + " could not be found"});
        return res.serverError({ error : "Error reading cache file" })
      }

      return res.ok(JSON.parse(data));
    })

  }

};

