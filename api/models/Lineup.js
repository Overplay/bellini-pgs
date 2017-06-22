/**
 * Lineup.js
 *
 * @description :: Program lineups provided by the TVMedia.ca api
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var moment = require("moment")
module.exports = {
  //autoPK: false,
  attributes: {
    lineupID: {
      type: 'text',
      //primaryKey: true //set this to the primary key to keep it in line with tvmedia db and for program associations
    },
    lineupName: {
      type: 'text'
    },
    lineupType: {
      type: 'text'
    },
    providerID: {
      type: 'text'
    },
    providerName: {
      type: 'text'
    },
    serviceArea: {
      type: 'text'
    },
    country: {
      type: 'text'
    },
    zip: {
      type: 'array',
      defaultsTo: []
    },

    /*listings: {
     collection: 'program',
     via: 'lineup'
     },*/

    lastAccessed: {
      type: 'datetime',
      defaultsTo: moment().format("YYYY-MM-DD HH:mm:ss")
    },
    active: {
      type: 'boolean',
      defaultsTo: true
    },
    toJSON: function () {
      var obj = this.toObject();
      if (!sails.config.policies.wideOpen) {
        delete obj.active;
        //delete obj.lineupID;
        delete obj.providerID;
      }
      return obj;
    }
  }
};
