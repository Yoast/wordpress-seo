// Make sure the Jed object is globally available
const Jed = require( "jed" );

const FactoryProto = function() {};

FactoryProto.prototype.buildJed = function() {
	return new Jed( {
		domain: "js-text-analysis",
		locale_data: {
			"js-text-analysis": {
				"": {},
			},
		},
	} );
};

const Factory = new FactoryProto();

module.exports = Factory;