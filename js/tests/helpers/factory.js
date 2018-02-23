// Make sure the Jed object is globally available
let Jed = require('jed');

let FactoryProto = function(){};

FactoryProto.prototype.buildJed = function() {
	return new Jed({
		"domain": "js-text-analysis",
		"locale_data": {
			"js-text-analysis": {
				"": {}
			}
		}
	});
};

let Factory = new FactoryProto();

module.exports = Factory;
