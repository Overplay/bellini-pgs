/**
 * Created by mkahn on 10/19/16.
 */


app.factory( "sailsBestPosition", function ( sailsApi, sailsCoreModel, userAuthService ) {


    var getAll = function ( queryString ) {
        return sailsApi.getModels( 'bestPosition', queryString )
            .then( function ( bps ) {
                return bps.map( newBestPosition ); //TODO: write this method
            } )
    };

    var CoreModel = sailsCoreModel.CoreModel;

    function ModelBestPositionObject( json ) {

        CoreModel.call( this );

        this.modelType = 'bestPosition';

        this.parseInbound = function ( json ) {
            this.carrier = json && json.carrier || '';
            this.channelNumber = json && json.channelNumber || '';
            this.network = json && json.network;
            this.lineupID = json && json.lineupID || '';
            this.programID = json && json.programID || '';
            this.postalCode = json && json.postalCode || '';
            this.widgetLocation = json && json.widgetLocation || {};
            this.crawlerLocation = json && json.crawlerLocation || {};

            this.parseCore( json );
        };

        this.getPostObj = function () {
            var fields = [ 'carrier', 'channelNumber', 'network', 'lineupID', 'programID', 'postalCode', 'widgetLocation', 'crawlerLocation' ];
            return this.cloneUsingFields( fields );
        };


        this.parseInbound( json );
    }

    ModelBestPositionObject.prototype = Object.create( CoreModel.prototype );
    ModelBestPositionObject.prototype.constructor = ModelBestPositionObject;


    var newBestPosition = function ( params ) {
        return new ModelBestPositionObject( params );
    }

    var getBestPosition = function ( id ) {

        if ( id == 'new' )
            return newBestPosition( { } );

        return sailsApi.getModel( 'bestPosition', id )
            .then( newBestPosition );
    }



    return {
        getAll:            getAll,
        new:               newBestPosition,
        get:               getBestPosition
    }

} );