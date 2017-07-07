/**
 * Created by alexawestlake on 6/23/17.
 */

module.exports = {
  attributes: {

    carrier : {
      type : 'string'
    },

    channelNumber : {
      type: 'integer'
    },

    network : {
      type: 'string'
    },

    lineupID : {
      type: 'string'
    },

    programID: {
      type: 'string'
    },

    postalCode: {
      type: 'string'
    },

    //this is going to be an array of percentages of width and height

    location: {
      type: 'json'
    }

  }

}
