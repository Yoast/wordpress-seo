"use strict";

module.exports = function InvalidRangeError( message ) {
	Error.captureStackTrace( this, this.constructor );
	this.name = this.constructor.name;
	this.message = message || "Invalid range";
};

require( "util" ).inherits( module.exports, Error );
