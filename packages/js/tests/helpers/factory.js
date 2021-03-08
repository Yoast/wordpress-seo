// Make sure the Jed object is globally available
const Jed = require( "jed" );

// eslint-disable-next-line require-jsdoc
const FactoryProto = function() {};

FactoryProto.prototype.buildJed = function() {
	return new Jed( {
		domain: "js-text-analysis",
		/* eslint-disable-next-line camelcase */
		locale_data: {
			"js-text-analysis": {
				"": {},
			},
		},
	} );
};

const Factory = new FactoryProto();

module.exports = Factory;
