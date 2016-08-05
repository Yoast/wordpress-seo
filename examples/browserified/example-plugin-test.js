var AssessmentResult = require( "../../js/values/AssessmentResult.js" );

/**
 * Creates the testplugin
 * @param {object} app The app used to register plugin
 * @constructor
 */
var TestPlugin = function( app ){
	this.app = app;
};

/**
 * Registers the plugin and assessment to the app.
 */
TestPlugin.prototype.addPlugin = function() {
	this.app.registerPlugin( "example-plugin", { "status": "ready" } );
	this.app.registerAssessment(
		"example-assessment",
		{
			getResult: this.scorePlugin.bind( this )
		},
		"example-plugin" );
};

/**
 * A plugin that generates a random score.
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} the Assessmentresult
 */
TestPlugin.prototype.scorePlugin = function( paper, researcher, i18n ) {
	var result = Math.random() * 100;
	var assessmentResult = new AssessmentResult();

	if ( result < 25 ) {
		assessmentResult.setScore( -1 );
		assessmentResult.setText( " It's bad!" );
	}
	if ( result >= 25 && result < 50 ) {
		assessmentResult.setScore( 4 );
		assessmentResult.setText( " It's mediocre!" );
	}
	if ( result >= 50 && result < 75 ) {
		assessmentResult.setScore( 7 );
		assessmentResult.setText( " It's ok!" );
	}
	if ( result >= 75 ) {
		assessmentResult.setScore( 9 );
		assessmentResult.setText( " It's good!" );
	}

	return assessmentResult;
};

module.exports = TestPlugin;
