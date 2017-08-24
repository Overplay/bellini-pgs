/**
 * Created by mkahn on 10/19/16.
 */


app.factory( "sailsBestPosition", function ( sailsApi, sailsCoreModel2 ) {


    const getAll = function ( queryString ) {
        return sailsApi.getModels( 'bestPosition', queryString )
            .then( function ( bps ) {
                return bps.map( newBestPosition ); //TODO: write this method
            } )
    };


    class ModelBestPositionObject extends sailsCoreModel2.CoreModel {

        constructor(params){
            super(params);
            this.modelType = 'bestPosition';
            this.parseInbound(params);
        }

        parseInbound( json ) {
            this.carrier = json && json.carrier || '';
            this.channelNumber = json && json.channelNumber || '';
            this.network = json && json.network;
            this.lineupID = json && json.lineupID || '';
            this.programID = json && json.programID || '';
            this.seriesID = json && json.seriesID || '';
            this.entryType = json && json.entryType || 'show';
            this.eventType = json && json.eventType || '';

            this.widgetLocation = json && json.widgetLocation || {};
            this.crawlerLocation = json && json.crawlerLocation || {};

        };

        getPostObj() {
            const fields = [ 'carrier', 'channelNumber', 'network', 'lineupID', 'programID', 'seriesID', 'entryType',
                'eventType', 'widgetLocation', 'crawlerLocation' ];
            return this.cloneUsingFields( fields );
        };

    }


    const newBestPosition = function ( params ) {
        return new ModelBestPositionObject( params );
    }

    const getBestPosition = function ( id ) {

        if ( id === 'new' )
            return newBestPosition( { } );

        return sailsApi.getModel( 'bestPosition', id )
            .then( newBestPosition );
    }



    return {
        getAll:            getAll,
        new:               newBestPosition,
        get:               getBestPosition,
        selections: {
            entryType: [ 'network default', 'show', 'event on network' ],
            eventType: [ 'baseball', 'basketball', 'soccer', 'hockey', 'football', 'golf' ]
        }
    }

} );