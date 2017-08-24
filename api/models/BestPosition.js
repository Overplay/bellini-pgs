/**
 * Created by alexawestlake on 6/23/17.
 */

module.exports = {
    attributes: {

        carrier: {
            type: 'string'
        },

        channelNumber: {
            type: 'integer'
        },

        network: {
            type: 'string',
            required: true
        },

        lineupID: {
            type: 'string'
        },

        programID: {
            type: 'string'
        },

        seriesID: {
            type: 'string'
        },

        entryType: {
            type: 'string',
            enum: [ 'network default', 'show', 'event on network']
        },

        eventType: {
            type: 'string',
            enum: [ 'baseball', 'basketball', 'soccer', 'hockey', 'football', 'golf' ]
        },

        //this is going to be an array of percentages of width and height

        widgetLocation: {
            type: 'json',
            defaultsTo: {}
        },

        crawlerLocation: {
            type: 'json',
            defaultsTo: {}
        }
    }

}
